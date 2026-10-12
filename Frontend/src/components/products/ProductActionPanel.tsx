'use client';

import React from 'react';
import { Star, ShieldCheck, Truck, RotateCcw, Minus, Plus, ShoppingBag, Check, Loader2 } from 'lucide-react';

interface ProductActionPanelProps {
    product: any;
    quantity: number;
    onQuantityChange: (q: number) => void;
    onAddToCart: () => void;
    addingCart: boolean;
    addedToast: boolean;
}

export default function ProductActionPanel({
    product,
    quantity,
    onQuantityChange,
    onAddToCart,
    addingCart,
    addedToast
}: ProductActionPanelProps) {
    const isOutOfStock = product.stock === 0;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span className="text-emerald-700">{product.brand || product.category?.name || 'PetCare Hub'}</span>
                    <span>SKU: {product._id?.slice(-6).toUpperCase()}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                    {product.name}
                </h1>
                <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={`w-4 h-4 ${
                                    s <= Math.round(product.rating || 5)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-gray-200'
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-gray-700">
                        {product.rating ? product.rating.toFixed(1) : '5.0'}
                    </span>
                    <span className="text-xs text-gray-400">
                        ({product.numReviews || 0} customer reviews)
                    </span>
                </div>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-baseline justify-between">
                <div>
                    <span className="text-xs text-gray-500 font-semibold block">Retail Price</span>
                    <span className="text-3xl font-black text-gray-900">
                        ${product.price?.toFixed(2)}
                    </span>
                </div>
                <div>
                    <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                            isOutOfStock
                                ? 'bg-rose-100 text-rose-800'
                                : product.stock <= 5
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                        }`}
                    >
                        {isOutOfStock ? 'Out of Stock' : `${product.stock} Units Available`}
                    </span>
                </div>
            </div>

            {/* Quantity and Cart CTA */}
            <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
                        <button
                            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1 || isOutOfStock}
                            className="p-2 rounded-lg hover:bg-white text-gray-600 disabled:opacity-40 transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-gray-900">
                            {quantity}
                        </span>
                        <button
                            onClick={() => onQuantityChange(Math.min(product.stock || 10, quantity + 1))}
                            disabled={quantity >= (product.stock || 1) || isOutOfStock}
                            className="p-2 rounded-lg hover:bg-white text-gray-600 disabled:opacity-40 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={onAddToCart}
                        disabled={isOutOfStock || addingCart}
                        className={`flex-1 py-3.5 px-6 rounded-2xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                            addedToast
                                ? 'bg-emerald-700 text-white'
                                : isOutOfStock
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                        }`}
                    >
                        {addingCart ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Adding to Cart...</span>
                            </>
                        ) : addedToast ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Added to Cart!</span>
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="w-4 h-4" />
                                <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Highlights / Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-center">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                    <Truck className="w-5 h-5 text-emerald-600 mx-auto" />
                    <span className="text-[11px] font-bold text-gray-700 block">Fast Delivery</span>
                    <span className="text-[10px] text-gray-400 block">Free over $50</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                    <ShieldCheck className="w-5 h-5 text-teal-600 mx-auto" />
                    <span className="text-[11px] font-bold text-gray-700 block">Vet Approved</span>
                    <span className="text-[10px] text-gray-400 block">Certified safe</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                    <RotateCcw className="w-5 h-5 text-cyan-600 mx-auto" />
                    <span className="text-[11px] font-bold text-gray-700 block">30-Day Return</span>
                    <span className="text-[10px] text-gray-400 block">Hassle-free</span>
                </div>
            </div>
        </div>
    );
}
