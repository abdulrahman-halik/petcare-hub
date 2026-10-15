'use client';

import React from 'react';
import { CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from '@/lib/axiosConfig';
import { Address } from './CheckoutAddressStep';

interface CheckoutPaymentStepProps {
    shipping: Address;
    billing: Address;
    sameAsShipping: boolean;
    paypalClientId: string;
    totalAmount: number;
    error: string;
    onError: (msg: string) => void;
    onStartProcessing: () => void;
    onPaymentSuccess: (orderId: string) => Promise<void>;
    onPaymentCancel: () => void;
    onBackToShipping: () => void;
}

export default function CheckoutPaymentStep({
    shipping,
    billing,
    sameAsShipping,
    paypalClientId,
    totalAmount,
    error,
    onError,
    onStartProcessing,
    onPaymentSuccess,
    onPaymentCancel,
    onBackToShipping
}: CheckoutPaymentStepProps) {
    const paypalOptions = React.useMemo(() => ({
        clientId: paypalClientId,
        currency: 'USD',
        intent: 'capture'
    }), [paypalClientId]);

    return (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <CreditCard className="w-5 h-5 text-[#047857]" />
                    <span>Secure Payment</span>
                </div>
                <span className="text-xs bg-emerald-50 text-[#047857] font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                    Encrypted 256-Bit
                </span>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3.5 rounded-xl border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-4">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900">
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                        <ShieldCheck className="w-4 h-4 text-[#047857]" />
                        <span>PayPal & Credit / Debit Card Gateway</span>
                    </div>
                    <span>Complete your transaction securely via PayPal account or direct credit/debit card processing.</span>
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
                            ${totalAmount.toFixed(2)} USD
                        </span>
                    </div>
                </div>

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
                                    onError('');
                                    try {
                                        const res = await axios.post('/payments/paypal/create-order', {
                                            shippingAddress: shipping
                                        });
                                        return res.data.data.orderId;
                                    } catch (err: unknown) {
                                        const apiError = err as { response?: { data?: { message?: string } } };
                                        const msg = apiError.response?.data?.message || 'Failed to initialize PayPal order.';
                                        onError(msg);
                                        throw new Error(msg);
                                    }
                                }}
                                onApprove={async (data) => {
                                    onError('');
                                    onStartProcessing();
                                    try {
                                        const captureRes = await axios.post('/payments/paypal/capture-order', {
                                            orderId: data.orderID,
                                            shippingAddress: shipping,
                                            billingAddress: sameAsShipping ? shipping : billing
                                        });
                                        const order = captureRes.data.data.order;
                                        await onPaymentSuccess(order._id);
                                    } catch (err: unknown) {
                                        const apiError = err as { response?: { data?: { message?: string } } };
                                        onError(apiError.response?.data?.message || 'PayPal capture failed. Please try again.');
                                    }
                                }}
                                onCancel={() => {
                                    onPaymentCancel();
                                }}
                                onError={(err) => {
                                    console.error('PayPal checkout error:', err);
                                    onError('PayPal checkout encountered an error. Please verify your sandbox session.');
                                }}
                            />
                        </PayPalScriptProvider>
                    </div>
                ) : (
                    <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-xl">
                        Loading payment gateway configuration...
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={onBackToShipping}
                className="w-full text-sm text-gray-500 hover:text-gray-700 text-center py-2 transition-colors cursor-pointer"
            >
                ← Back to Shipping Address
            </button>
        </div>
    );
}
