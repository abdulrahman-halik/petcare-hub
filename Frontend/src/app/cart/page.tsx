'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
    const { cart, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [updating, setUpdating] = useState<string | null>(null);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Sign in to view your cart</h2>
                    <Link href="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition-colors inline-block mt-2">Sign In</Link>
                </div>
            </div>
        );
    }

    const items = cart?.items || [];

    const handleQtyChange = async (productId: string, newQty: number) => {
        if (newQty < 1) return;
        setUpdating(productId);
        try { await updateQuantity(productId, newQty); } catch (e: any) { alert(e.response?.data?.message || 'Update failed'); }
        setUpdating(null);
    };

    const handleRemove = async (productId: string) => {
        setUpdating(productId);
        try { await removeFromCart(productId); } catch { /* ignore */ }
        setUpdating(null);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <ShoppingCart className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Browse our catalog and add something for your pet!</p>
                    <Link href="/products" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6 text-emerald-600" />
                        Shopping Cart
                        <span className="text-sm font-normal text-gray-500 ml-1">({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                    </h1>
                    <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 underline">Clear All</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item: any) => (
                            <div key={item.product} className="bg-white rounded-2xl shadow-xs border border-gray-100 p-4 flex gap-4">
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">🐾</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/products/${item.product}`} className="font-semibold text-gray-900 hover:text-emerald-600 line-clamp-2 text-sm">
                                        {item.name}
                                    </Link>
                                    <p className="text-emerald-600 font-bold mt-1">${item.price.toFixed(2)} <span className="text-gray-400 font-normal text-xs">each</span></p>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQtyChange(item.product, item.quantity - 1)}
                                                disabled={!!updating}
                                                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center font-semibold text-sm">{updating === item.product ? '...' : item.quantity}</span>
                                            <button
                                                onClick={() => handleQtyChange(item.product, item.quantity + 1)}
                                                disabled={!!updating}
                                                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-gray-900">${item.subtotal.toFixed(2)}</span>
                                            <button onClick={() => handleRemove(item.product)} className="text-red-400 hover:text-red-600 p-1">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${cart?.subtotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (10%)</span>
                                    <span className="font-medium">${cart?.tax?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-medium">
                                        {cart?.shippingFee === 0 ? <span className="text-emerald-600 font-semibold">FREE</span> : `$${cart?.shippingFee?.toFixed(2)}`}
                                    </span>
                                </div>
                                {(cart?.subtotal ?? 0) < 50 && (
                                    <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg p-2">
                                        Add ${(50 - (cart?.subtotal ?? 0)).toFixed(2)} more for free shipping!
                                    </p>
                                )}
                                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                                    <span>Total</span>
                                    <span>${cart?.total?.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push('/checkout')}
                                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout <ArrowRight className="w-4 h-4" />
                            </button>
                            <Link href="/products" className="mt-3 w-full text-center text-sm text-gray-500 hover:text-emerald-600 block py-2">
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
