'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CreditCard, Lock, Truck, CheckCircle, ChevronRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from '@/lib/axiosConfig';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface Address {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
}

interface FinancialTotals {
    subtotal: number;
    tax: number;
    shippingFee: number;
    total: number;
    amount?: number;
}

const emptyAddr = (): Address => ({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: ''
});

function AddressForm({
    values,
    onChange,
    title
}: {
    values: Address;
    onChange: (v: Address) => void;
    title?: string;
}) {
    return (
        <div className="space-y-4">
            {title && <h3 className="font-semibold text-gray-800">{title}</h3>}
            <div className="grid grid-cols-2 gap-3">
                {(['firstName', 'lastName'] as const).map(f => (
                    <input
                        key={f}
                        placeholder={f === 'firstName' ? 'First Name *' : 'Last Name *'}
                        required
                        value={values[f]}
                        onChange={e => onChange({ ...values, [f]: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                ))}
            </div>
            <input
                placeholder="Street Address *"
                required
                value={values.address}
                onChange={e => onChange({ ...values, address: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="grid grid-cols-2 gap-3">
                <input
                    placeholder="City *"
                    required
                    value={values.city}
                    onChange={e => onChange({ ...values, city: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                    placeholder="State / Province"
                    value={values.state}
                    onChange={e => onChange({ ...values, state: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <input
                    placeholder="Postal Code *"
                    required
                    value={values.postalCode}
                    onChange={e => onChange({ ...values, postalCode: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                    placeholder="Country *"
                    required
                    value={values.country}
                    onChange={e => onChange({ ...values, country: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>
            <input
                placeholder="Phone Number"
                value={values.phone}
                onChange={e => onChange({ ...values, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
        </div>
    );
}

function CheckoutContent() {
    const { user } = useAuth();
    const { cart, refreshCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [step, setStep] = useState<'address' | 'payment' | 'processing'>('address');
    const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'mock'>('paypal');
    const [shipping, setShipping] = useState<Address>(emptyAddr());
    const [billing, setBilling] = useState<Address>(emptyAddr());
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [intentId, setIntentId] = useState('');
    const [serverTotals, setServerTotals] = useState<FinancialTotals | null>(null);
    const [simulateFailure, setSimulateFailure] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Dynamic PayPal client ID from backend or environment
    const [paypalClientId, setPaypalClientId] = useState<string>(
        process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''
    );

    // Load saved address from sessionStorage if available
    useEffect(() => {
        try {
            const savedShip = sessionStorage.getItem('petcare_checkout_shipping');
            if (savedShip) {
                const parsed = JSON.parse(savedShip);
                if (parsed && typeof parsed === 'object') {
                    setShipping(parsed);
                }
            }
            const savedBill = sessionStorage.getItem('petcare_checkout_billing');
            if (savedBill) {
                const parsed = JSON.parse(savedBill);
                if (parsed && typeof parsed === 'object') {
                    setBilling(parsed);
                }
            }
        } catch {
            // ignore storage errors
        }
    }, []);

    // Fetch PayPal config from backend
    useEffect(() => {
        axios.get('/payments/paypal/config')
            .then(res => {
                if (res.data?.data?.clientId) {
                    setPaypalClientId(res.data.data.clientId);
                }
            })
            .catch(() => {
                // If backend call fails, fallback to NEXT_PUBLIC_PAYPAL_CLIENT_ID if set
            });
    }, []);

    // Handle return / cancel redirects from PayPal
    useEffect(() => {
        const redirectStatus = searchParams.get('status');
        const token = searchParams.get('token'); // PayPal order ID

        if (redirectStatus === 'cancel') {
            setError('PayPal payment was cancelled. Your cart items are preserved.');
            setStep('payment');
        } else if (redirectStatus === 'success' && token) {
            // Auto-capture the redirected order
            setStep('processing');
            setLoading(true);

            let storedShipping = shipping;
            try {
                const raw = sessionStorage.getItem('petcare_checkout_shipping');
                if (raw) storedShipping = JSON.parse(raw);
            } catch { }

            axios.post('/payments/paypal/capture-order', {
                orderId: token,
                shippingAddress: storedShipping
            })
                .then(async res => {
                    const order = res.data?.data?.order;
                    try {
                        sessionStorage.removeItem('petcare_checkout_shipping');
                        sessionStorage.removeItem('petcare_checkout_billing');
                    } catch { }
                    await refreshCart();
                    if (order?._id) {
                        router.push(`/orders/confirmation/${order._id}`);
                    } else {
                        router.push('/orders');
                    }
                })
                .catch(err => {
                    const apiError = err as { response?: { data?: { message?: string } } };
                    setError(apiError.response?.data?.message || 'PayPal capture failed upon redirect. Please try again.');
                    setStep('payment');
                    setLoading(false);
                });
        }
    }, [searchParams, router, refreshCart, shipping]);

    // Memoized PayPal SDK options to prevent re-instantiation renders
    const paypalOptions = useMemo(() => ({
        clientId: paypalClientId,
        currency: 'USD',
        intent: 'capture'
    }), [paypalClientId]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-xs border border-gray-100 text-center max-w-sm w-full">
                    <Lock className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in Required</h2>
                    <p className="text-gray-500 text-sm mb-6">Please log in to proceed with checkout.</p>
                    <Link href="/login" className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const items = cart?.items || [];
    if (items.length === 0 && step !== 'processing') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xs border border-gray-100 max-w-md w-full">
                    <p className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</p>
                    <p className="text-gray-500 text-sm mb-6">Add some pet essentials to your cart before checking out.</p>
                    <Link href="/products" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    const validateAddr = (a: Address) =>
        Boolean(
            a.firstName?.trim() &&
            a.lastName?.trim() &&
            a.address?.trim() &&
            a.city?.trim() &&
            a.postalCode?.trim() &&
            a.country?.trim()
        );

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!validateAddr(shipping)) {
            setError('Please fill in all required shipping fields.');
            return;
        }
        if (!sameAsShipping && !validateAddr(billing)) {
            setError('Please fill in all required billing fields.');
            return;
        }

        // Save to sessionStorage for page persistence and PayPal redirect support
        try {
            sessionStorage.setItem('petcare_checkout_shipping', JSON.stringify(shipping));
            sessionStorage.setItem('petcare_checkout_billing', JSON.stringify(sameAsShipping ? shipping : billing));
        } catch { }

        setLoading(true);
        try {
            const { data } = await axios.post('/payments/intent');
            setIntentId(data.data.intentId);
            setServerTotals(data.data);
            setStep('payment');
        } catch (err: unknown) {
            const apiError = err as { response?: { data?: { message?: string } } };
            setError(apiError.response?.data?.message || 'Could not prepare checkout totals. Please check your cart.');
        }
        setLoading(false);
    };

    // Handler for Mock Payment testing
    const handleMockPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setStep('processing');
        try {
            // Step 1: Confirm mock payment
            const payRes = await axios.post('/payments/mock', { intentId, simulateFailure });
            if (payRes.data.status !== 'success') {
                throw new Error(payRes.data.message);
            }
            const paymentInfo = payRes.data.data;

            // Step 2: Create order
            const orderRes = await axios.post('/orders', {
                shippingAddress: shipping,
                billingAddress: sameAsShipping ? shipping : billing,
                payment: paymentInfo
            });
            const order = orderRes.data.data.order;
            try {
                sessionStorage.removeItem('petcare_checkout_shipping');
                sessionStorage.removeItem('petcare_checkout_billing');
            } catch { }
            await refreshCart();
            router.push(`/orders/confirmation/${order._id}`);
        } catch (err: unknown) {
            const apiError = err as { response?: { data?: { message?: string } } };
            setError(apiError.response?.data?.message || 'Payment simulation failed. Please try again.');
            setStep('payment');
            setLoading(false);
        }
    };

    const totals = serverTotals || cart;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Progress Steps Header */}
                <div className="flex items-center gap-2 mb-8 text-sm font-medium">
                    <span className={`px-3 py-1 rounded-full transition-colors ${step === 'address' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                        1. Shipping
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    <span className={`px-3 py-1 rounded-full transition-colors ${step === 'payment' || step === 'processing' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        2. Payment
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-400">
                        3. Confirmation
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Checkout Interaction Area */}
                    <div className="lg:col-span-2">
                        {step === 'processing' && (
                            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-12 text-center">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <Lock className="w-8 h-8 text-emerald-600 animate-spin" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Payment...</h2>
                                <p className="text-gray-500 text-sm">Please do not refresh or close this page while we secure your order.</p>
                            </div>
                        )}

                        {step === 'address' && (
                            <form onSubmit={handleAddressSubmit} className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-6">
                                <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <Truck className="w-5 h-5 text-emerald-600" /> Shipping Information
                                </div>
                                <AddressForm values={shipping} onChange={setShipping} />

                                <div className="pt-2 border-t border-gray-100">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={sameAsShipping}
                                            onChange={e => setSameAsShipping(e.target.checked)}
                                            className="w-4 h-4 accent-emerald-600"
                                        />
                                        Billing address is the same as shipping
                                    </label>
                                </div>

                                {!sameAsShipping && (
                                    <AddressForm values={billing} onChange={setBilling} title="Billing Information" />
                                )}

                                {error && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-100">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm"
                                >
                                    {loading ? 'Preparing Checkout...' : <><Lock className="w-4 h-4" /> Continue to Payment</>}
                                </button>
                            </form>
                        )}

                        {step === 'payment' && (
                            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                        <CreditCard className="w-5 h-5 text-emerald-600" /> Choose Payment Method
                                    </div>
                                    <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                                        Encrypted 256-Bit
                                    </span>
                                </div>

                                {/* Payment Method Switcher */}
                                <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('paypal')}
                                        className={`py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${paymentMethod === 'paypal'
                                            ? 'bg-white text-emerald-700 shadow-xs'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> PayPal / Cards
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('mock')}
                                        className={`py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${paymentMethod === 'mock'
                                            ? 'bg-white text-emerald-700 shadow-xs'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        🧪 Mock Test Gateway
                                    </button>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3.5 rounded-xl border border-red-100">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* PAYPAL SANDBOX PAYMENT OPTION */}
                                {paymentMethod === 'paypal' && (
                                    <div className="space-y-4">
                                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900">
                                            <div className="font-bold flex items-center gap-1.5 mb-1">
                                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                                PayPal Sandbox Gateway Active
                                            </div>
                                            Click the PayPal button below to pay securely via PayPal Sandbox or with debit/credit card.
                                        </div>

                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm space-y-1">
                                            <div className="flex justify-between text-gray-500 text-xs">
                                                <span>Ship To</span>
                                                <span className="text-gray-800 font-medium">
                                                    {shipping.firstName} {shipping.lastName}, {shipping.city}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-gray-500 text-xs">
                                                <span>Total to Authorize</span>
                                                <span className="font-bold text-gray-900 text-sm">
                                                    ${(serverTotals?.amount || totals?.total || 0).toFixed(2)} USD
                                                </span>
                                            </div>
                                        </div>

                                        {/* PayPal SDK Script & Buttons */}
                                        {paypalClientId ? (
                                            <div className="min-h-[140px] pt-2">
                                                <PayPalScriptProvider options={paypalOptions}>
                                                    <PayPalButtons
                                                        style={{
                                                            layout: 'vertical',
                                                            shape: 'rect',
                                                            borderRadius: 12,
                                                            color: 'gold',
                                                            label: 'buynow'
                                                        }}
                                                        createOrder={async () => {
                                                            setError('');
                                                            try {
                                                                const res = await axios.post('/payments/paypal/create-order', {
                                                                    shippingAddress: shipping
                                                                });
                                                                return res.data.data.orderId;
                                                            } catch (err: unknown) {
                                                                const apiError = err as { response?: { data?: { message?: string } } };
                                                                const msg = apiError.response?.data?.message || 'Failed to initialize PayPal order.';
                                                                setError(msg);
                                                                throw new Error(msg);
                                                            }
                                                        }}
                                                        onApprove={async data => {
                                                            setError('');
                                                            setLoading(true);
                                                            setStep('processing');
                                                            try {
                                                                const captureRes = await axios.post('/payments/paypal/capture-order', {
                                                                    orderId: data.orderID,
                                                                    shippingAddress: shipping,
                                                                    billingAddress: sameAsShipping ? shipping : billing
                                                                });

                                                                const order = captureRes.data.data.order;
                                                                try {
                                                                    sessionStorage.removeItem('petcare_checkout_shipping');
                                                                    sessionStorage.removeItem('petcare_checkout_billing');
                                                                } catch { }
                                                                await refreshCart();
                                                                router.push(`/orders/confirmation/${order._id}`);
                                                            } catch (err: unknown) {
                                                                const apiError = err as { response?: { data?: { message?: string } } };
                                                                setError(apiError.response?.data?.message || 'PayPal capture failed. Please try again.');
                                                                setStep('payment');
                                                                setLoading(false);
                                                            }
                                                        }}
                                                        onCancel={() => {
                                                            setError('PayPal payment was cancelled. Your cart items are preserved.');
                                                        }}
                                                        onError={err => {
                                                            console.error('PayPal checkout error:', err);
                                                            setError('PayPal checkout encountered an error. Please verify your sandbox session.');
                                                        }}
                                                    />
                                                </PayPalScriptProvider>
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-xl">
                                                Loading PayPal configuration...
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* MOCK PAYMENT OPTION */}
                                {paymentMethod === 'mock' && (
                                    <form onSubmit={handleMockPayment} className="space-y-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                                            <strong>🧪 Test Mode — Offline Mock Gateway</strong><br />
                                            Simulate payment flow without opening external sandbox logins.
                                        </div>
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Transaction ID</span>
                                                <span className="font-mono text-gray-700 text-xs">{intentId.slice(0, 24)}...</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Amount</span>
                                                <span className="font-bold text-gray-900">${serverTotals?.amount?.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm text-red-600">
                                            <input
                                                type="checkbox"
                                                checked={simulateFailure}
                                                onChange={e => setSimulateFailure(e.target.checked)}
                                                className="w-4 h-4 accent-red-500"
                                            />
                                            Simulate payment failure (for QA testing)
                                        </label>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm"
                                        >
                                            <Lock className="w-4 h-4" /> {loading ? 'Processing...' : 'Buy Now'}
                                        </button>
                                    </form>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setStep('address')}
                                    className="w-full text-sm text-gray-500 hover:text-gray-700 text-center py-2 transition-colors"
                                >
                                    ← Back to Shipping Address
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 h-fit sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>Order Summary</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal">
                                {items.length} {items.length === 1 ? 'item' : 'items'}
                            </span>
                        </h3>
                        <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
                            {items.map(item => (
                                <div key={item.product} className="flex gap-3 text-sm items-center">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100 relative">
                                        {item.imageUrl ? (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.name}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-lg">🐾</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate text-xs">{item.name}</p>
                                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-gray-800 font-semibold text-xs shrink-0">
                                        ${(item.subtotal || ((item.price || 0) * item.quantity)).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${totals?.subtotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (10%)</span>
                                <span>${totals?.tax?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>
                                    {totals?.shippingFee === 0 ? (
                                        <span className="text-emerald-600 font-medium">FREE</span>
                                    ) : (
                                        `$${totals?.shippingFee?.toFixed(2)}`
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-3 text-base">
                                <span>Total</span>
                                <span className="text-emerald-700">${totals?.total?.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1">
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Free shipping on orders over $50
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> 100% Satisfaction Guarantee
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-xs border border-gray-100 text-center max-w-sm w-full">
                    <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium text-sm">Loading checkout...</p>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
