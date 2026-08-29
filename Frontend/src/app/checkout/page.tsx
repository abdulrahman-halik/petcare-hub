'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Lock, Truck, CheckCircle, ChevronRight } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface Address {
    firstName: string; lastName: string; address: string;
    city: string; state: string; postalCode: string; country: string; phone: string;
}

const emptyAddr = (): Address => ({ firstName: '', lastName: '', address: '', city: '', state: '', postalCode: '', country: 'United States', phone: '' });

export default function CheckoutPage() {
    const { user } = useAuth();
    const { cart, refreshCart } = useCart();
    const router = useRouter();

    const [step, setStep] = useState<'address' | 'payment' | 'processing'>('address');
    const [shipping, setShipping] = useState<Address>(emptyAddr());
    const [billing, setBilling] = useState<Address>(emptyAddr());
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [intentId, setIntentId] = useState('');
    const [serverTotals, setServerTotals] = useState<any>(null);
    const [simulateFailure, setSimulateFailure] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!user) return <div className="min-h-screen flex items-center justify-center"><Link href="/login" className="text-emerald-600 underline">Sign in to checkout</Link></div>;

    const items = cart?.items || [];
    if (items.length === 0 && step !== 'processing') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
                <div><p className="text-xl font-bold text-gray-700 mb-4">Your cart is empty.</p>
                    <Link href="/products" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold">Browse Products</Link></div>
            </div>
        );
    }

    const validateAddr = (a: Address) => a.firstName && a.lastName && a.address && a.city && a.postalCode && a.country;

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!validateAddr(shipping)) { setError('Please fill all required shipping fields.'); return; }
        if (!sameAsShipping && !validateAddr(billing)) { setError('Please fill all required billing fields.'); return; }
        setLoading(true);
        try {
            const { data } = await axios.post('/payments/intent');
            setIntentId(data.data.intentId);
            setServerTotals(data.data);
            setStep('payment');
        } catch (e: any) { setError(e.response?.data?.message || 'Could not prepare checkout. Please check your cart.'); }
        setLoading(false);
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setStep('processing');
        try {
            // Step 1: Confirm mock payment
            const payRes = await axios.post('/payments/mock', { intentId, simulateFailure });
            if (payRes.data.status !== 'success') throw new Error(payRes.data.message);
            const paymentInfo = payRes.data.data;

            // Step 2: Create order
            const orderRes = await axios.post('/orders', {
                shippingAddress: shipping,
                billingAddress: sameAsShipping ? shipping : billing,
                payment: paymentInfo
            });
            const order = orderRes.data.data.order;
            await refreshCart();
            router.push(`/orders/confirmation/${order._id}`);
        } catch (e: any) {
            setError(e.response?.data?.message || 'Payment failed. Please try again.');
            setStep('payment');
        }
        setLoading(false);
    };

    const AddressForm = ({ values, onChange, title }: { values: Address; onChange: (v: Address) => void; title: string }) => (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <div className="grid grid-cols-2 gap-3">
                {(['firstName','lastName'] as const).map(f => (
                    <input key={f} placeholder={f === 'firstName' ? 'First Name *' : 'Last Name *'} required
                        value={values[f]} onChange={e => onChange({ ...values, [f]: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                ))}
            </div>
            <input placeholder="Street Address *" required value={values.address} onChange={e => onChange({ ...values, address: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            <div className="grid grid-cols-2 gap-3">
                <input placeholder="City *" required value={values.city} onChange={e => onChange({ ...values, city: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                <input placeholder="State / Province" value={values.state} onChange={e => onChange({ ...values, state: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <input placeholder="Postal Code *" required value={values.postalCode} onChange={e => onChange({ ...values, postalCode: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                <input placeholder="Country *" required value={values.country} onChange={e => onChange({ ...values, country: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <input placeholder="Phone Number" value={values.phone} onChange={e => onChange({ ...values, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
    );

    const totals = serverTotals || cart;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Progress Steps */}
                <div className="flex items-center gap-2 mb-8 text-sm font-medium">
                    <span className={`px-3 py-1 rounded-full ${step === 'address' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>1. Shipping</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    <span className={`px-3 py-1 rounded-full ${step === 'payment' || step === 'processing' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>2. Payment</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-400">3. Confirm</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Area */}
                    <div className="lg:col-span-2">
                        {step === 'processing' && (
                            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-12 text-center">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <CreditCard className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Payment...</h2>
                                <p className="text-gray-500 text-sm">Please do not close this page.</p>
                            </div>
                        )}

                        {step === 'address' && (
                            <form onSubmit={handleAddressSubmit} className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-6">
                                <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <Truck className="w-5 h-5 text-emerald-600" /> Shipping Information
                                </div>
                                <AddressForm values={shipping} onChange={setShipping} title="" />
                                <div>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                                        <input type="checkbox" checked={sameAsShipping} onChange={e => setSameAsShipping(e.target.checked)} className="w-4 h-4 accent-emerald-600" />
                                        Billing address same as shipping
                                    </label>
                                </div>
                                {!sameAsShipping && <AddressForm values={billing} onChange={setBilling} title="Billing Information" />}
                                {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}
                                <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                                    {loading ? 'Preparing...' : <><Lock className="w-4 h-4" /> Continue to Payment</>}
                                </button>
                            </form>
                        )}

                        {step === 'payment' && (
                            <form onSubmit={handlePayment} className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-6">
                                <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <CreditCard className="w-5 h-5 text-emerald-600" /> Payment
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                                    <strong>🧪 Test Mode — Mock Payment Gateway</strong><br />
                                    No real card needed. Click "Pay Now" to simulate a successful payment.
                                </div>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">Transaction ID</span><span className="font-mono text-gray-700 text-xs">{intentId.slice(0, 24)}...</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-gray-900">${serverTotals?.amount?.toFixed(2)}</span></div>
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-red-600">
                                    <input type="checkbox" checked={simulateFailure} onChange={e => setSimulateFailure(e.target.checked)} className="w-4 h-4 accent-red-500" />
                                    Simulate payment failure (for testing)
                                </label>
                                {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}
                                <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                                    <Lock className="w-4 h-4" /> {loading ? 'Processing...' : `Pay $${serverTotals?.amount?.toFixed(2)}`}
                                </button>
                                <button type="button" onClick={() => setStep('address')} className="w-full text-sm text-gray-500 hover:text-gray-700 text-center py-1">← Back to Shipping</button>
                            </form>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 h-fit sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                            {items.map((item: any) => (
                                <div key={item.product} className="flex gap-2 text-sm">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                        {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🐾</div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate text-xs">{item.name}</p>
                                        <p className="text-gray-400 text-xs">×{item.quantity}</p>
                                    </div>
                                    <span className="text-gray-700 font-semibold text-xs shrink-0">${item.subtotal.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-3 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${totals?.subtotal?.toFixed(2)}</span></div>
                            <div className="flex justify-between text-gray-600"><span>Tax (10%)</span><span>${totals?.tax?.toFixed(2)}</span></div>
                            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{totals?.shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `$${totals?.shippingFee?.toFixed(2)}`}</span></div>
                            <div className="flex justify-between font-bold text-gray-900 border-t pt-2"><span>Total</span><span>${totals?.total?.toFixed(2)}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
