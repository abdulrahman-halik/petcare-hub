/**
 * Phase 5 Integration Tests — PetCareHub E-Commerce Core & Payments
 * Run: node tests/phase5_test.js
 * Prerequisites: Backend running on port 5000, MongoDB connected
 */

const axios = require('axios');

const BASE = 'http://localhost:5000/api';
const api = axios.create({ baseURL: BASE, withCredentials: true });

let authCookie = '';
let testProductId = '';
let testOrderId = '';

// Track cookie for session
api.interceptors.response.use(res => {
    const setCookie = res.headers['set-cookie'];
    if (setCookie) authCookie = setCookie[0].split(';')[0];
    return res;
});
api.interceptors.request.use(cfg => {
    if (authCookie) cfg.headers.Cookie = authCookie;
    return cfg;
});

const pass = (msg) => console.log(`  ✅ PASS: ${msg}`);
const fail = (msg, err) => console.error(`  ❌ FAIL: ${msg}`, err?.response?.data?.message || err?.message || '');
const section = (title) => console.log(`\n📦 ${title}`);

const runTest = async (label, fn) => {
    try { await fn(); pass(label); }
    catch (e) { fail(label, e); }
};

// ─────────────── Auth Setup ───────────────
async function setupAuth() {
    section('Auth Setup');
    const email = `phase5_test_${Date.now()}@petcarehub.test`;
    const pw = 'TestPass123!';

    await runTest('Register customer', async () => {
        const { data } = await api.post('/auth/register', { name: 'Phase5 Tester', email, password: pw, role: 'customer' });
        if (data.status !== 'success') throw new Error('Register failed');
    });

    await runTest('Login customer', async () => {
        const { data } = await api.post('/auth/login', { email, password: pw });
        if (data.status !== 'success') throw new Error('Login failed');
    });

    // Get a product for tests
    try {
        const { data } = await api.get('/products?limit=1');
        if (data.data.products.length > 0) {
            testProductId = data.data.products[0]._id;
        }
    } catch { /* no products, some tests will skip */ }
}

// ─────────────── Cart Tests ───────────────
async function testCart() {
    section('Cart Tests');

    await runTest('Get empty cart', async () => {
        const { data } = await api.get('/cart');
        if (data.status !== 'success') throw new Error('Cart fetch failed');
    });

    if (testProductId) {
        await runTest('Add product to cart', async () => {
            const { data } = await api.post('/cart', { productId: testProductId, quantity: 1 });
            if (data.status !== 'success') throw new Error('Add to cart failed');
        });

        await runTest('Add invalid productId rejected', async () => {
            try { await api.post('/cart', { productId: 'invalid-id' }); throw new Error('Should have failed'); }
            catch (e) { if (e.response?.status !== 400) throw e; }
        });

        await runTest('Update cart quantity', async () => {
            const { data } = await api.put(`/cart/${testProductId}`, { quantity: 2 });
            if (data.status !== 'success') throw new Error('Update failed');
            if (data.data.cart.items[0].quantity !== 2) throw new Error('Quantity not updated');
        });

        await runTest('Cart totals calculated server-side', async () => {
            const { data } = await api.get('/cart');
            const cart = data.data.cart;
            if (!cart.subtotal || !cart.total) throw new Error('Totals missing');
            const expectedSub = Math.round(cart.items.reduce((s, i) => s + i.subtotal, 0) * 100) / 100;
            if (Math.abs(cart.subtotal - expectedSub) > 0.01) throw new Error('Subtotal mismatch');
        });

        await runTest('Remove product from cart', async () => {
            const { data } = await api.delete(`/cart/${testProductId}`);
            if (data.status !== 'success') throw new Error('Remove failed');
        });

        await runTest('Add product back for checkout tests', async () => {
            await api.post('/cart', { productId: testProductId, quantity: 1 });
        });
    }

    await runTest('Unauthenticated cart access rejected', async () => {
        const unauthApi = axios.create({ baseURL: BASE });
        try { await unauthApi.get('/cart'); throw new Error('Should be 401'); }
        catch (e) { if (e.response?.status !== 401) throw e; }
    });
}

// ─────────────── Wishlist Tests ───────────────
async function testWishlist() {
    section('Wishlist Tests');

    await runTest('Get empty wishlist', async () => {
        const { data } = await api.get('/wishlist');
        if (data.status !== 'success') throw new Error('Wishlist fetch failed');
    });

    if (testProductId) {
        await runTest('Add product to wishlist', async () => {
            const { data } = await api.post('/wishlist', { productId: testProductId });
            if (data.status !== 'success') throw new Error('Add to wishlist failed');
        });

        await runTest('Duplicate wishlist item rejected (409)', async () => {
            try { await api.post('/wishlist', { productId: testProductId }); throw new Error('Should be 409'); }
            catch (e) { if (e.response?.status !== 409) throw e; }
        });

        await runTest('Check wishlist item (isWishlisted=true)', async () => {
            const { data } = await api.get(`/wishlist/${testProductId}/check`);
            if (!data.data.isWishlisted) throw new Error('Should be wishlisted');
        });

        await runTest('Remove from wishlist', async () => {
            const { data } = await api.delete(`/wishlist/${testProductId}`);
            if (data.status !== 'success') throw new Error('Remove failed');
        });

        await runTest('Check wishlist item (isWishlisted=false after remove)', async () => {
            const { data } = await api.get(`/wishlist/${testProductId}/check`);
            if (data.data.isWishlisted) throw new Error('Should not be wishlisted');
        });
    }
}

// ─────────────── Payment Tests ───────────────
async function testPayments() {
    section('Payment Tests');

    if (testProductId) {
        await runTest('Create payment intent (validates cart)', async () => {
            const { data } = await api.post('/payments/intent');
            if (data.status !== 'success') throw new Error('Intent failed');
            if (!data.data.intentId) throw new Error('No intentId');
        });

        await runTest('Mock payment success', async () => {
            const intentRes = await api.post('/payments/intent');
            const { data } = await api.post('/payments/mock', { intentId: intentRes.data.data.intentId });
            if (data.status !== 'success') throw new Error('Mock payment failed');
            if (data.data.paymentStatus !== 'paid') throw new Error('Status not paid');
        });

        await runTest('Mock payment failure simulation', async () => {
            try {
                const intentRes = await api.post('/payments/intent');
                await api.post('/payments/mock', { intentId: intentRes.data.data.intentId, simulateFailure: true });
                throw new Error('Should have failed');
            } catch (e) { if (e.response?.status !== 402) throw e; }
        });
    }

    await runTest('Payment intent requires auth', async () => {
        const unauthApi = axios.create({ baseURL: BASE });
        try { await unauthApi.post('/payments/intent'); throw new Error('Should be 401'); }
        catch (e) { if (e.response?.status !== 401) throw e; }
    });
}

// ─────────────── Order Tests ───────────────
async function testOrders() {
    section('Order Tests');

    const shippingAddress = { firstName: 'John', lastName: 'Doe', address: '123 Pet St', city: 'Petville', state: 'CA', postalCode: '90210', country: 'United States', phone: '555-0100' };

    await runTest('Create order after successful payment', async () => {
        // Re-add product if cart was cleared
        if (testProductId) {
            try { await api.post('/cart', { productId: testProductId, quantity: 1 }); } catch { /* already in cart */ }
        }

        const intentRes = await api.post('/payments/intent');
        const payRes = await api.post('/payments/mock', { intentId: intentRes.data.data.intentId });
        const payment = payRes.data.data;

        const { data } = await api.post('/orders', { shippingAddress, payment });
        if (data.status !== 'success') throw new Error('Order creation failed');
        testOrderId = data.data.order._id;
        if (!testOrderId) throw new Error('No order ID returned');
    });

    await runTest('Duplicate order (same transactionId) rejected', async () => {
        if (!testProductId) return;
        try { await api.post('/cart', { productId: testProductId, quantity: 1 }); } catch { }
        const intentRes = await api.post('/payments/intent');
        const payRes = await api.post('/payments/mock', { intentId: intentRes.data.data.intentId });
        const payment = payRes.data.data;

        await api.post('/orders', { shippingAddress, payment });
        try { await api.post('/orders', { shippingAddress, payment }); throw new Error('Should be 409'); }
        catch (e) { if (e.response?.status !== 409) throw e; }
    });

    await runTest('Get order list', async () => {
        const { data } = await api.get('/orders');
        if (data.status !== 'success') throw new Error('Failed');
        if (!Array.isArray(data.data.orders)) throw new Error('Not array');
    });

    if (testOrderId) {
        await runTest('Get order by ID (owner)', async () => {
            const { data } = await api.get(`/orders/${testOrderId}`);
            if (data.status !== 'success') throw new Error('Failed');
        });

        await runTest('Order not accessible by other user', async () => {
            const email2 = `other_${Date.now()}@test.com`;
            const otherApi = axios.create({ baseURL: BASE });
            let c2 = '';
            otherApi.interceptors.response.use(r => { const sc = r.headers['set-cookie']; if (sc) c2 = sc[0].split(';')[0]; return r; });
            otherApi.interceptors.request.use(cfg => { if (c2) cfg.headers.Cookie = c2; return cfg; });

            await otherApi.post('/auth/register', { name: 'Other', email: email2, password: 'Pass123!', role: 'customer' });
            try { await otherApi.get(`/orders/${testOrderId}`); throw new Error('Should be 403'); }
            catch (e) { if (e.response?.status !== 403) throw e; }
        });
    }

    await runTest('Order with empty cart rejected', async () => {
        // Cart should be empty now (cleared after last order)
        try {
            const intentRes = await api.post('/payments/intent');
            await api.post('/orders', { shippingAddress, payment: { transactionId: intentRes.data.data.intentId, status: 'paid', provider: 'mock' } });
            throw new Error('Should fail with empty cart');
        } catch (e) { if (e.response?.status !== 400) throw e; }
    });

    await runTest('Order with missing address rejected', async () => {
        if (testProductId) { try { await api.post('/cart', { productId: testProductId, quantity: 1 }); } catch { } }
        try { await api.post('/orders', { shippingAddress: { firstName: 'Only' }, payment: { transactionId: 'x', status: 'paid' } }); throw new Error('Should be 400'); }
        catch (e) { if (e.response?.status !== 400) throw e; }
    });
}

// ─────────────── Reviews Tests ───────────────
async function testReviews() {
    section('Review Tests');

    if (testProductId) {
        await runTest('Get product reviews (public)', async () => {
            const { data } = await api.get(`/products/${testProductId}/reviews`);
            if (data.status !== 'success') throw new Error('Failed');
        });

        await runTest('Non-purchaser cannot review', async () => {
            // Register fresh user with no orders
            const email3 = `nopurchase_${Date.now()}@test.com`;
            const freshApi = axios.create({ baseURL: BASE });
            let c3 = '';
            freshApi.interceptors.response.use(r => { const sc = r.headers['set-cookie']; if (sc) c3 = sc[0].split(';')[0]; return r; });
            freshApi.interceptors.request.use(cfg => { if (c3) cfg.headers.Cookie = c3; return cfg; });
            await freshApi.post('/auth/register', { name: 'NoPurchase', email: email3, password: 'Pass123!', role: 'customer' });
            try { await freshApi.post(`/products/${testProductId}/reviews`, { rating: 5, comment: 'Great product!' }); throw new Error('Should be 403'); }
            catch (e) { if (e.response?.status !== 403) throw e; }
        });

        await runTest('Invalid rating rejected', async () => {
            try { await api.post(`/products/${testProductId}/reviews`, { rating: 10, comment: 'Test' }); throw new Error('Should fail'); }
            catch (e) { if (!e.response || (e.response.status !== 400 && e.response.status !== 403)) throw e; }
        });

        // If we have a completed order with this product, test creating a review
        if (testOrderId) {
            await runTest('Verified purchaser can leave review', async () => {
                const res = await api.post(`/products/${testProductId}/reviews`, { rating: 5, comment: 'My pet loves this product!' });
                if (res.data.status !== 'success') throw new Error('Review failed: ' + JSON.stringify(res.data));
            });

            await runTest('Duplicate review rejected (409)', async () => {
                try { await api.post(`/products/${testProductId}/reviews`, { rating: 4, comment: 'Another review' }); throw new Error('Should be 409'); }
                catch (e) { if (e.response?.status !== 409) throw e; }
            });
        }
    }
}

// ─────────────── Run All ───────────────
async function runAll() {
    console.log('\n🚀 PetCareHub Phase 5 Integration Tests\n' + '='.repeat(45));
    try {
        await setupAuth();
        await testCart();
        await testWishlist();
        await testPayments();
        await testOrders();
        await testReviews();
        console.log('\n' + '='.repeat(45));
        console.log('✅ All Phase 5 tests completed!\n');
    } catch (e) {
        console.error('\n💥 Unexpected error during test run:', e.message);
    }
}

runAll();
