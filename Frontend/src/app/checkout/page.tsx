'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ChevronRight } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CheckoutAddressStep, { Address } from '@/components/checkout/CheckoutAddressStep';
import CheckoutPaymentStep from '@/components/checkout/CheckoutPaymentStep';
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';

const emptyAddress = (): Address => ({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: ''
});

interface ServerTotals {
    intentId?: string;
    amount?: number;
    total?: number;
    subtotal?: number;
    tax?: number;
    shippingFee?: number;
    currency?: string;
}

function CheckoutContent() {
    const { user } = useAuth();
    const { cart, refreshCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [step, setStep] = useState<'address' | 'payment' | 'processing'>('address');
    const [shipping, setShipping] = useState<Address>(emptyAddress());
    const [billing, setBilling] = useState<Address>(emptyAddress());
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [serverTotals, setServerTotals] = useState<ServerTotals | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [paypalClientId, setPaypalClientId] = useState<string>(
        process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''
    );

    // Restore cached address from session
    useEffect(() => {
        try {
            const savedShip = sessionStorage.getItem('petcare_checkout_shipping');
            if (savedShip) setShipping(JSON.parse(savedShip));
            const savedBill = sessionStorage.getItem('petcare_checkout_billing');
            if (savedBill) setBilling(JSON.parse(savedBill));
        } catch { /* ignore session parse error */ }
    }, []);

    // Retrieve active PayPal sandbox credentials from backend
    useEffect(() => {
        axios.get('/payments/paypal/config')
            .then((res) => {
                if (res.data?.data?.clientId) setPaypalClientId(res.data.data.clientId);
            })
            .catch(() => {});
    }, []);

    // Handle return redirects from PayPal gateway
    useEffect(() => {
        const redirectStatus = searchParams.get('status');
        const token = searchParams.get('token');

        if (redirectStatus === 'cancel') {
            setError('Payment was cancelled. Your items remain saved in your cart.');
            setStep('payment');
        } else if (redirectStatus === 'success' && token) {
            setStep('processing');
            setLoading(true);

            let storedShipping = shipping;
            try {
                const raw = sessionStorage.getItem('petcare_checkout_shipping');
                if (raw) storedShipping = JSON.parse(raw);
            } catch {}

            axios.post('/payments/paypal/capture-order', {
                orderId: token,
                shippingAddress: storedShipping
            })
                .then(async (res) => {
                    const order = res.data?.data?.order;
                    try {
                        sessionStorage.removeItem('petcare_checkout_shipping');
                        sessionStorage.removeItem('petcare_checkout_billing');
                    } catch {}
                    await refreshCart();
                    router.push(order?._id ? `/orders/confirmation/${order._id}` : '/orders');
                })
                .catch((err) => {
                    const msg = err.response?.data?.message || 'Payment capture failed. Please try again.';
                    setError(msg);
                    setStep('payment');
                    setLoading(false);
                });
        }
    }, [searchParams, router, refreshCart, shipping]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-xs border border-gray-100 text-center max-w-sm w-full">
                    <Lock className="w-10 h-10 text-[#047857] mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in Required</h2>
                    <p className="text-gray-500 text-sm mb-6">Please log in to proceed with checkout.</p>
                    <Link href="/login" className="block w-full bg-[#047857] hover:bg-[#065f46] active:bg-[#064e3b] text-white font-bold py-3 rounded-xl transition-all shadow-xs">
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
                    <Link href="/products" className="inline-block bg-[#047857] hover:bg-[#065f46] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-xs">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!shipping.firstName || !shipping.address || !shipping.city || !shipping.postalCode) {
            setError('Please fill in all required shipping fields.');
            return;
        }

        try {
            sessionStorage.setItem('petcare_checkout_shipping', JSON.stringify(shipping));
            sessionStorage.setItem('petcare_checkout_billing', JSON.stringify(sameAsShipping ? shipping : billing));
        } catch {}

        setLoading(true);
        try {
            const { data } = await axios.post('/payments/intent');
            setServerTotals(data.data);
            setStep('payment');
        } catch (err: unknown) {
            const apiError = err as { response?: { data?: { message?: string } } };
            setError(apiError.response?.data?.message || 'Could not prepare checkout totals. Please check your cart.');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (orderId: string) => {
        try {
            sessionStorage.removeItem('petcare_checkout_shipping');
            sessionStorage.removeItem('petcare_checkout_billing');
        } catch {}
        await refreshCart();
        router.push(`/orders/confirmation/${orderId}`);
    };

    const totals = serverTotals
        ? {
            ...serverTotals,
            total: Number(serverTotals.total ?? serverTotals.amount ?? cart?.total ?? 0),
            amount: Number(serverTotals.amount ?? serverTotals.total ?? cart?.total ?? 0),
            subtotal: Number(serverTotals.subtotal ?? cart?.subtotal ?? 0),
            tax: Number(serverTotals.tax ?? cart?.tax ?? 0),
            shippingFee: Number(serverTotals.shippingFee ?? cart?.shippingFee ?? 0)
        }
        : cart;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-2 mb-8 text-sm font-medium">
                    <span className={`px-3 py-1 rounded-full transition-colors ${step === 'address' ? 'bg-[#047857] text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                        1. Shipping
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    <span className={`px-3 py-1 rounded-full transition-colors ${step === 'payment' || step === 'processing' ? 'bg-[#047857] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        2. Payment
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-400">
                        3. Confirmation
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {step === 'processing' && (
                            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-12 text-center">
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <Lock className="w-8 h-8 text-[#047857] animate-spin" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Payment...</h2>
                                <p className="text-gray-500 text-sm">Please do not refresh or close this page while we secure your order.</p>
                            </div>
                        )}

                        {step === 'address' && (
                            <CheckoutAddressStep
                                shipping={shipping}
                                onShippingChange={setShipping}
                                billing={billing}
                                onBillingChange={setBilling}
                                sameAsShipping={sameAsShipping}
                                onSameAsShippingChange={setSameAsShipping}
                                onSubmit={handleAddressSubmit}
                                loading={loading}
                                error={error}
                            />
                        )}

                        {step === 'payment' && (
                            <CheckoutPaymentStep
                                shipping={shipping}
                                billing={billing}
                                sameAsShipping={sameAsShipping}
                                paypalClientId={paypalClientId}
                                totalAmount={totals?.total ?? 0}
                                error={error}
                                onError={setError}
                                onStartProcessing={() => {
                                    setStep('processing');
                                    setLoading(true);
                                }}
                                onPaymentSuccess={handlePaymentSuccess}
                                onPaymentCancel={() => setError('Payment was cancelled. Your items remain saved in your cart.')}
                                onBackToShipping={() => setStep('address')}
                            />
                        )}
                    </div>

                    <CheckoutOrderSummary items={items} totals={totals} />
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
                    <div className="w-10 h-10 border-4 border-[#047857] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium text-sm">Loading checkout...</p>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
