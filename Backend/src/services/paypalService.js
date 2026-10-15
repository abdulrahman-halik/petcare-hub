const axios = require('axios');

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Normalizes PayPal REST API Base URL.
 * PayPal v2 REST APIs require https://api-m.sandbox.paypal.com (sandbox)
 * or https://api-m.paypal.com (live), even if configured as https://sandbox.paypal.com.
 */
const getPayPalApiBaseUrl = () => {
    let raw = (process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com').trim();
    raw = raw.replace(/\/+$/, '');

    if (raw === 'https://sandbox.paypal.com') {
        return 'https://api-m.sandbox.paypal.com';
    }
    if (raw === 'https://paypal.com' || raw === 'https://www.paypal.com') {
        return 'https://api-m.paypal.com';
    }
    return raw;
};

/**
 * Clear cached OAuth token
 */
const clearTokenCache = () => {
    cachedToken = null;
    tokenExpiresAt = 0;
};

/**
 * Normalizes country strings to 2-letter ISO 3166-1 alpha-2 codes required by PayPal
 */
const normalizeCountryCode = (country) => {
    if (!country) return 'US';
    const c = country.trim().toUpperCase();
    if (c === 'UNITED STATES' || c === 'USA' || c === 'US') return 'US';
    if (c === 'UNITED KINGDOM' || c === 'UK' || c === 'GREAT BRITAIN' || c === 'GB') return 'GB';
    if (c === 'CANADA' || c === 'CA') return 'CA';
    if (c === 'AUSTRALIA' || c === 'AU') return 'AU';
    if (c === 'GERMANY' || c === 'DE') return 'DE';
    if (c === 'FRANCE' || c === 'FR') return 'FR';
    if (c.length === 2) return c;
    return 'US';
};

/**
 * Formats error responses from PayPal APIs into descriptive messages
 */
const extractPayPalError = (error, fallback) => {
    if (error.response?.data) {
        const data = error.response.data;
        if (Array.isArray(data.details) && data.details.length > 0) {
            const detailMsgs = data.details
                .map(d => `${d.issue ? d.issue + ': ' : ''}${d.description || ''}`)
                .filter(Boolean)
                .join('; ');
            if (detailMsgs) return detailMsgs;
        }
        if (data.error_description) return data.error_description;
        if (data.message) return data.message;
        if (typeof data === 'string') return data;
    }
    return error.message || fallback;
};

/**
 * Retrieves an OAuth 2.0 Access Token from PayPal with in-memory caching
 */
const getAccessToken = async (forceRefresh = false) => {
    const now = Date.now();
    // Re-use cached token if still valid (buffer of 60 seconds)
    if (!forceRefresh && cachedToken && tokenExpiresAt > now + 60000) {
        return cachedToken;
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('PayPal Client ID or Secret is not configured in backend environment variables.');
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const baseUrl = getPayPalApiBaseUrl();

    try {
        const response = await axios.post(
            `${baseUrl}/v1/oauth2/token`,
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 10000
            }
        );

        cachedToken = response.data.access_token;
        // expires_in is in seconds
        tokenExpiresAt = now + (response.data.expires_in * 1000);
        return cachedToken;
    } catch (error) {
        const message = extractPayPalError(error, 'Authentication failed');
        throw new Error(`PayPal Authentication failed: ${message}`);
    }
};

/**
 * Creates a PayPal v2 Checkout Order
 * @param {Object} params
 * @param {Array} params.items - Validated order items
 * @param {Object} params.financials - { subtotal, tax, shippingFee, total }
 * @param {Object} [params.shippingAddress] - Shipping address details
 * @param {string} [params.customId] - Optional tracking/user ID
 */
const createPayPalOrder = async ({ items, financials, shippingAddress, customId }) => {
    const accessToken = await getAccessToken();
    const baseUrl = getPayPalApiBaseUrl();
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');

    // Ensure item calculations match breakdown values exactly (2 decimal places)
    const normalizedItems = (items || []).map(item => {
        const unitAmount = Number(item.unitPrice || 0);
        const quantity = Math.max(1, Number(item.quantity || 1));
        return {
            name: (item.name || 'PetCare Product').substring(0, 127),
            unit_amount: {
                currency_code: 'USD',
                value: unitAmount.toFixed(2)
            },
            quantity: String(quantity),
            _rawUnit: unitAmount,
            _rawQty: quantity
        };
    });

    const itemTotalCalc = normalizedItems.reduce((acc, it) => acc + (it._rawUnit * it._rawQty), 0);
    const subtotal = Number(financials.subtotal !== undefined ? financials.subtotal : itemTotalCalc);
    const tax = Number(financials.tax || 0);
    const shipping = Number(financials.shippingFee || 0);
    const total = Number(financials.total !== undefined ? financials.total : (subtotal + tax + shipping));

    const purchaseUnit = {
        reference_id: `petcare_${Date.now()}`,
        description: 'PetCare Hub Purchase',
        custom_id: customId ? String(customId) : undefined,
        amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
            breakdown: {
                item_total: {
                    currency_code: 'USD',
                    value: subtotal.toFixed(2)
                },
                tax_total: {
                    currency_code: 'USD',
                    value: tax.toFixed(2)
                },
                shipping: {
                    currency_code: 'USD',
                    value: shipping.toFixed(2)
                }
            }
        },
        items: normalizedItems.map(({ name, unit_amount, quantity }) => ({ name, unit_amount, quantity }))
    };

    if (shippingAddress) {
        const fullName = `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || 'Valued Customer';
        purchaseUnit.shipping = {
            name: {
                full_name: fullName.substring(0, 300)
            },
            address: {
                address_line_1: (shippingAddress.address || '123 Main St').substring(0, 300),
                admin_area_2: (shippingAddress.city || 'San Jose').substring(0, 120),
                admin_area_1: (shippingAddress.state || 'CA').substring(0, 120),
                postal_code: (shippingAddress.postalCode || '95131').substring(0, 60),
                country_code: normalizeCountryCode(shippingAddress.country)
            }
        };
    }

    const payload = {
        intent: 'CAPTURE',
        purchase_units: [purchaseUnit],
        application_context: {
            brand_name: 'PetCare Hub',
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            shipping_preference: shippingAddress ? 'SET_PROVIDED_ADDRESS' : 'GET_FROM_FILE',
            return_url: `${frontendUrl}/checkout?status=success`,
            cancel_url: `${frontendUrl}/checkout?status=cancel`
        }
    };

    try {
        const response = await axios.post(
            `${baseUrl}/v2/checkout/orders`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );

        return response.data;
    } catch (error) {
        // If 401 unauthorized, clear cached token
        if (error.response?.status === 401) {
            clearTokenCache();
        }
        const errorDetail = extractPayPalError(error, 'Order creation rejected');
        throw new Error(`PayPal Order Creation failed: ${errorDetail}`);
    }
};

/**
 * Captures payment for an approved PayPal Order
 * @param {string} orderId - PayPal Order ID
 */
const capturePayPalOrder = async (orderId) => {
    if (!orderId) {
        throw new Error('PayPal Order ID is required for capture.');
    }

    const accessToken = await getAccessToken();
    const baseUrl = getPayPalApiBaseUrl();

    try {
        const response = await axios.post(
            `${baseUrl}/v2/checkout/orders/${orderId}/capture`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation',
                    'PayPal-Request-Id': `cap_${orderId}`
                },
                timeout: 15000
            }
        );

        const data = response.data;
        const purchaseUnit = data.purchase_units?.[0];
        const capture = purchaseUnit?.payments?.captures?.[0];

        return {
            raw: data,
            orderId: data.id,
            status: data.status, // Should be 'COMPLETED'
            captureId: capture?.id || data.id,
            captureStatus: capture?.status || data.status,
            amount: capture?.amount?.value || purchaseUnit?.amount?.value,
            currency: capture?.amount?.currency_code || 'USD',
            payerEmail: data.payer?.email_address || '',
            payerName: data.payer?.name ? `${data.payer.name.given_name || ''} ${data.payer.name.surname || ''}`.trim() : '',
            shipping: purchaseUnit?.shipping,
            updateTime: capture?.update_time || data.update_time || new Date().toISOString()
        };
    } catch (error) {
        // Handle case where order was already captured (e.g. idempotency retry)
        const errorData = error.response?.data;
        const issues = (errorData?.details || []).map(d => d.issue);

        if (issues.includes('ORDER_ALREADY_CAPTURED') || errorData?.name === 'UNPROCESSABLE_ENTITY' && JSON.stringify(errorData).includes('ORDER_ALREADY_CAPTURED')) {
            try {
                const orderData = await getPayPalOrderDetails(orderId);
                if (orderData.status === 'COMPLETED') {
                    const purchaseUnit = orderData.purchase_units?.[0];
                    const capture = purchaseUnit?.payments?.captures?.[0];
                    return {
                        raw: orderData,
                        orderId: orderData.id,
                        status: orderData.status,
                        captureId: capture?.id || orderData.id,
                        captureStatus: capture?.status || orderData.status,
                        amount: capture?.amount?.value || purchaseUnit?.amount?.value,
                        currency: capture?.amount?.currency_code || 'USD',
                        payerEmail: orderData.payer?.email_address || '',
                        payerName: orderData.payer?.name ? `${orderData.payer.name.given_name || ''} ${orderData.payer.name.surname || ''}`.trim() : '',
                        shipping: purchaseUnit?.shipping,
                        updateTime: capture?.update_time || orderData.update_time || new Date().toISOString()
                    };
                }
            } catch (recoveryErr) {
                // Continue to throw original capture error
            }
        }

        if (error.response?.status === 401) {
            clearTokenCache();
        }
        const errorDetail = extractPayPalError(error, 'Capture failed');
        throw new Error(`PayPal Capture failed: ${errorDetail}`);
    }
};

/**
 * Gets details of a PayPal Order
 * @param {string} orderId
 */
const getPayPalOrderDetails = async (orderId) => {
    const accessToken = await getAccessToken();
    const baseUrl = getPayPalApiBaseUrl();

    try {
        const response = await axios.get(
            `${baseUrl}/v2/checkout/orders/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            clearTokenCache();
        }
        const errorDetail = extractPayPalError(error, error.message);
        throw new Error(`Failed to fetch PayPal order: ${errorDetail}`);
    }
};

module.exports = {
    getPayPalApiBaseUrl,
    getAccessToken,
    clearTokenCache,
    createPayPalOrder,
    capturePayPalOrder,
    getPayPalOrderDetails,
    normalizeCountryCode
};
