'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

interface CheckoutOrderSummaryProps {
    items: Array<{
        product: string;
        name: string;
        price: number;
        imageUrl?: string;
        quantity: number;
        subtotal?: number;
    }>;
    totals: {
        subtotal?: number;
        tax?: number;
        shippingFee?: number;
        total?: number;
        amount?: number;
    } | null;
}

export default function CheckoutOrderSummary({ items, totals }: CheckoutOrderSummaryProps) {
    const subtotal = totals?.subtotal ?? 0;
    const tax = totals?.tax ?? 0;
    const shippingFee = totals?.shippingFee ?? 0;
    const total = totals?.total ?? totals?.amount ?? 0;

    return (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 h-fit sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>Order Summary</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
            </h3>

            <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
                {items.map((item) => (
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
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                        {shippingFee === 0 ? (
                            <span className="text-[#047857] font-medium">FREE</span>
                        ) : (
                            `$${shippingFee.toFixed(2)}`
                        )}
                    </span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-3 text-base">
                    <span>Total</span>
                    <span className="text-[#047857]">${total.toFixed(2)}</span>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1">
                <div className="flex items-center gap-1.5 text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-[#047857]" />
                    <span>Free express shipping on qualifying orders</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-[#047857]" />
                    <span>100% Pet Parent Satisfaction Guarantee</span>
                </div>
            </div>
        </div>
    );
}
