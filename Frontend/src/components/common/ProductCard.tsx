'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShieldCheck, Eye, Sparkles, Heart, ShoppingCart } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        description?: string;
        price: number;
        stock: number;
        category?: {
            _id?: string;
            name?: string;
            slug?: string;
        };
        supplier?: {
            _id?: string;
            name?: string;
        };
        imageUrl?: string;
        images?: string[];
        rating?: number;
        numReviews?: number;
        petType?: string;
        brand?: string;
    };
    onQuickView?: (product: any) => void;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { user } = useAuth();
    const { addToCart, cart } = useCart();
    const [addingCart, setAddingCart] = useState(false);
    const [wishlisting, setWishlisting] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500); };
    const inCart = cart?.items?.some((i: any) => i.product === product._id) ?? false;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setAddingCart(true);
        try {
            await addToCart(product._id, 1, {
                name: product.name,
                price: product.price,
                imageUrl: displayImage
            });
            showToast('Added to cart!');
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Failed to add');
        } finally {
            setAddingCart(false);
        }
    };

    const handleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) { window.location.href = '/login'; return; }
        setWishlisting(true);
        try { await axios.post('/wishlist', { productId: product._id }); showToast('Saved to wishlist!'); }
        catch (err: any) { showToast(err.response?.data?.message || 'Failed'); }
        setWishlisting(false);
    };
    const displayImage = product.imageUrl || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    return (
        <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
            {toastMsg && <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md whitespace-nowrap">{toastMsg}</div>}
            {/* Image & Badges */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                <Link href={`/products/${product._id}`} className="block w-full h-full">
                    <img
                        src={displayImage}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                </Link>

                {/* Stock Status Badge */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {isOutOfStock ? (
                        <span className="bg-red-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs">
                            Out of Stock
                        </span>
                    ) : isLowStock ? (
                        <span className="bg-amber-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs">
                            Only {product.stock} Left!
                        </span>
                    ) : (
                        <span className="bg-emerald-600/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> In Stock
                        </span>
                    )}

                    {product.petType && product.petType !== 'all' && (
                        <span className="bg-white/90 text-gray-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs border border-gray-200/60 backdrop-blur-xs w-fit">
                            {product.petType}
                        </span>
                    )}
                </div>

                {/* Quick view link overlay button */}
                <Link
                    href={`/products/${product._id}`}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 text-gray-700 hover:bg-emerald-600 hover:text-white shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    title="Quick Details"
                >
                    <Eye className="w-4 h-4" />
                </Link>
            </div>

            {/* Product Body */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                    {/* Category & Supplier */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium text-emerald-600 truncate max-w-[55%]">
                            {product.category?.name || 'Pet Essentials'}
                        </span>
                        {product.supplier?.name && (
                            <span className="flex items-center gap-1 text-[11px] text-gray-400 truncate max-w-[40%]" title={`Supplier: ${product.supplier.name}`}>
                                <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0" />
                                <span className="truncate">{product.supplier.name}</span>
                            </span>
                        )}
                    </div>

                    {/* Product Name */}
                    <Link href={`/products/${product._id}`} className="block">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 hover:text-emerald-600 transition-colors leading-snug">
                            {product.name}
                        </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                        <div className="flex items-center text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-gray-800 ml-1">
                                {product.rating ? product.rating.toFixed(1) : '5.0'}
                            </span>
                        </div>
                        <span className="text-xs text-gray-400">
                            ({product.numReviews || 0})
                        </span>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
                    <div>
                        <span className="text-xs text-gray-400 block -mb-0.5">Price</span>
                        <span className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                            ${Number(product.price).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {/* Wishlist button */}
                        <button
                            onClick={handleWishlist}
                            disabled={wishlisting}
                            title="Save to Wishlist"
                            className="p-2 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                        >
                            <Heart className="w-4 h-4" />
                        </button>

                        {/* Add to Cart button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || addingCart}
                            className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 ${
                                isOutOfStock
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : inCart
                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                            }`}
                        >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            {addingCart ? '...' : inCart ? 'In Cart' : 'Add'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
