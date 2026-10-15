'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartDrawer() {
    const { isCartOpen, closeCart, cart, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Close drawer on Escape key press and lock background scroll
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isCartOpen) {
                closeCart();
            }
        };

        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isCartOpen, closeCart]);

    if (!isCartOpen) return null;

    const items = cart?.items || [];
    const subtotal = cart?.subtotal || 0;
    const freeShippingThreshold = 50;
    const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
    const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

    const handleQtyChange = async (productId: string, newQty: number) => {
        if (newQty < 1 || updatingId) return;
        setUpdatingId(productId);
        try {
            await updateQuantity(productId, newQty);
        } catch (err: any) {
            console.error('Failed to update quantity:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRemove = async (productId: string) => {
        if (updatingId) return;
        setUpdatingId(productId);
        try {
            await removeFromCart(productId);
        } catch (err) {
            console.error('Failed to remove item:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleProceedToCheckout = () => {
        closeCart();
        if (!user) {
            router.push('/login?redirect=/checkout');
        } else {
            router.push('/checkout');
        }
    };

    const handleViewCartPage = () => {
        closeCart();
        router.push('/cart');
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            {/* Backdrop Blur Overlay */}
            <div
                onClick={closeCart}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out animate-in fade-in"
                aria-hidden="true"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
                    {/* Drawer Header */}
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 id="slide-over-title" className="text-lg font-black text-slate-900">
                                    Your Cart
                                </h2>
                                <span className="text-xs text-slate-500 font-medium">
                                    {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={closeCart}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            aria-label="Close cart drawer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Free Shipping Incentive Progress Bar */}
                    <div className="px-6 py-3.5 bg-emerald-50/60 border-b border-emerald-100/60">
                        {amountNeededForFreeShipping > 0 ? (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs text-emerald-800 font-medium">
                                    <span>Add <span className="font-bold">${amountNeededForFreeShipping.toFixed(2)}</span> more for <strong>FREE shipping</strong></span>
                                    <span>{Math.round(progressToFreeShipping)}%</span>
                                </div>
                                <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${progressToFreeShipping}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>🎉 You unlocked <strong>FREE Shipping!</strong></span>
                            </div>
                        )}
                    </div>

                    {/* Drawer Body: Scrollable Item List */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                                <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                                    <p className="text-xs text-slate-500 max-w-xs">
                                        Explore premium pet nutrition, vet-approved care, and accessories!
                                    </p>
                                </div>
                                <Link
                                    href="/products"
                                    onClick={closeCart}
                                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                                >
                                    Browse Products <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        ) : (
                            items.map((item: any) => (
                                <div
                                    key={item.product}
                                    className="flex gap-4 p-3.5 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all shadow-2xs"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">
                                                🐾
                                            </div>
                                        )}
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <Link
                                                href={`/products/${item.product}`}
                                                onClick={closeCart}
                                                className="text-xs font-bold text-slate-900 hover:text-emerald-700 line-clamp-1 transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-xs font-bold text-emerald-700 mt-0.5">
                                                ${item.price.toFixed(2)}
                                                <span className="text-[11px] font-normal text-slate-400 ml-1">each</span>
                                            </p>
                                        </div>

                                        {/* Quantity Stepper & Price / Delete */}
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/80">
                                                <button
                                                    type="button"
                                                    onClick={() => handleQtyChange(item.product, item.quantity - 1)}
                                                    disabled={item.quantity <= 1 || updatingId === item.product}
                                                    className="p-1 rounded-md hover:bg-white text-slate-600 disabled:opacity-40 transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-7 text-center font-bold text-xs text-slate-900">
                                                    {updatingId === item.product ? (
                                                        <Loader2 className="w-3 h-3 animate-spin mx-auto text-emerald-600" />
                                                    ) : (
                                                        item.quantity
                                                    )}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQtyChange(item.product, item.quantity + 1)}
                                                    disabled={updatingId === item.product}
                                                    className="p-1 rounded-md hover:bg-white text-slate-600 disabled:opacity-40 transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2.5">
                                                <span className="font-extrabold text-xs text-slate-900">
                                                    ${item.subtotal.toFixed(2)}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemove(item.product)}
                                                    disabled={updatingId === item.product}
                                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Drawer Footer */}
                    {items.length > 0 && (
                        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/70 space-y-4">
                            <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Estimated Tax (10%)</span>
                                    <span className="font-semibold text-slate-700">${(cart?.tax || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-slate-700">
                                        {cart?.shippingFee === 0 ? (
                                            <span className="text-emerald-700 font-bold">FREE</span>
                                        ) : (
                                            `$${(cart?.shippingFee || 0).toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className="border-t border-slate-200/80 pt-2 flex justify-between text-sm font-black text-slate-900">
                                    <span>Estimated Total</span>
                                    <span className="text-emerald-700 font-black">${(cart?.total || subtotal).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Primary Proceed to Checkout Button */}
                            <button
                                type="button"
                                onClick={handleProceedToCheckout}
                                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            {/* Secondary Link to Full Cart Page */}
                            <div className="flex items-center justify-between text-xs pt-1">
                                <button
                                    type="button"
                                    onClick={handleViewCartPage}
                                    className="font-bold text-slate-600 hover:text-emerald-700 transition-colors underline underline-offset-2"
                                >
                                    View Full Cart
                                </button>
                                <button
                                    type="button"
                                    onClick={clearCart}
                                    className="text-slate-400 hover:text-rose-600 transition-colors text-[11px]"
                                >
                                    Clear Cart
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Guaranteed Safe & Secure Checkout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
