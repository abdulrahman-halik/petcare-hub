'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Star, ShoppingBag, Info, Check, Loader2 } from 'lucide-react';

interface RecommendationCardProps {
    item: {
        product: {
            _id: string;
            name: string;
            price?: number;
            rating?: number;
            imageUrl?: string;
            images?: string[];
            brand?: string;
            category?: {
                name?: string;
            };
        };
        relevanceScore?: number;
        matchedPet?: {
            name: string;
        };
        primaryReason?: string;
    };
    isAdded: boolean;
    isAdding: boolean;
    onAddToCart: (productId: string) => void;
}

export default function RecommendationCard({
    item,
    isAdded,
    isAdding,
    onAddToCart
}: RecommendationCardProps) {
    const product = item.product;

    return (
        <div className="group relative bg-white rounded-2xl border border-gray-100/80 hover:border-emerald-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            {/* Top Image & Badges */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-50 p-4">
                <Link href={`/products/${product._id}`}>
                    <img
                        src={product.imageUrl || product.images?.[0] || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80'}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>

                {/* Relevance Match Score Pill */}
                {item.relevanceScore !== undefined && (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-extrabold text-emerald-700 border border-emerald-100 shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                        <span>{item.relevanceScore}% Match</span>
                    </div>
                )}

                {/* Pet Name Tag (if matched to pet) */}
                {item.matchedPet && (
                    <div className="absolute top-3 left-3 bg-emerald-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span>🐾 For {item.matchedPet.name}</span>
                    </div>
                )}
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                    {/* AI Recommendation Reason Banner */}
                    {item.primaryReason && (
                        <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-2 text-[11px] font-semibold text-emerald-800 flex items-start gap-1.5 leading-tight">
                            <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{item.primaryReason}</span>
                        </div>
                    )}

                    {/* Category & Brand */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span className="font-semibold uppercase tracking-wider text-emerald-600">
                            {product.brand || product.category?.name || 'PetCare Hub'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{product.rating ? product.rating.toFixed(1) : '4.8'}</span>
                        </div>
                    </div>

                    {/* Product Title */}
                    <Link href={`/products/${product._id}`}>
                        <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* Price and Action Button */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div>
                        <span className="text-xs text-gray-400 block -mb-0.5">Price</span>
                        <span className="text-lg font-black text-gray-900">
                            ${product.price ? product.price.toFixed(2) : '24.99'}
                        </span>
                    </div>

                    <button
                        onClick={() => onAddToCart(product._id)}
                        disabled={isAdding}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                            isAdded
                                ? 'bg-[#064e3b] text-white'
                                : 'bg-[#047857] hover:bg-[#065f46] text-white'
                        }`}
                    >
                        {isAdding ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Adding...</span>
                            </>
                        ) : isAdded ? (
                            <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added!</span>
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add to Cart</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
