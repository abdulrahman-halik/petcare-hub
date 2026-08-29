'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ShoppingBag } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function WishlistPage() {
    const { user } = useAuth();
    const { addToCart, cart } = useCart();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [toast, setToast] = useState('');

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const fetchWishlist = async () => {
        try {
            const { data } = await axios.get('/wishlist');
            setWishlist(data.data.wishlist.products || []);
        } catch { setWishlist([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (user) fetchWishlist(); else setLoading(false); }, [user]);

    const handleRemove = async (productId: string) => {
        setRemoving(productId);
        try {
            await axios.delete(`/wishlist/${productId}`);
            setWishlist(prev => prev.filter((p: any) => p.product?._id !== productId));
            showToast('Removed from wishlist');
        } catch { showToast('Failed to remove'); }
        setRemoving(null);
    };

    const handleAddToCart = async (productId: string) => {
        setAddingToCart(productId);
        try {
            await addToCart(productId, 1);
            showToast('Added to cart!');
        } catch (e: any) { showToast(e.response?.data?.message || 'Failed to add to cart'); }
        setAddingToCart(null);
    };

    const isInCart = (productId: string) => cart?.items?.some((i: any) => i.product === productId) ?? false;

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Sign in to view your wishlist</h2>
                <Link href="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition-colors inline-block mt-2">Sign In</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-medium">{toast}</div>}
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-8">
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> My Wishlist
                    <span className="text-sm font-normal text-gray-500">({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})</span>
                </h1>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[1,2,3].map(i => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse" />)}
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="text-center py-20">
                        <Heart className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-400 mb-6">Save products you love to buy them later.</p>
                        <Link href="/products" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" /> Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {wishlist.map((entry: any) => {
                            const p = entry.product;
                            if (!p) return null;
                            const inCart = isInCart(p._id);
                            const oos = p.stock <= 0;
                            return (
                                <div key={p._id} className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden group">
                                    <div className="relative aspect-square bg-gray-50">
                                        <Link href={`/products/${p._id}`}>
                                            <img src={p.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        </Link>
                                        {oos && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Out of Stock</span>}
                                        <button onClick={() => handleRemove(p._id)} disabled={removing === p._id} className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <Link href={`/products/${p._id}`} className="font-semibold text-gray-900 hover:text-emerald-600 text-sm line-clamp-2">{p.name}</Link>
                                        <p className="text-emerald-600 font-bold mt-1">${p.price?.toFixed(2)}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{oos ? 'Out of stock' : `${p.stock} in stock`}</p>
                                        <button
                                            onClick={() => handleAddToCart(p._id)}
                                            disabled={oos || !!addingToCart || inCart}
                                            className={`mt-3 w-full py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors
                                                ${inCart ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : oos ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            {inCart ? 'In Cart' : addingToCart === p._id ? 'Adding...' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
