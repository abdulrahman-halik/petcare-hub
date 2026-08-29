'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search,
    ShoppingBag,
    Sparkles,
    ShieldCheck,
    Truck,
    Store,
    ArrowRight,
    Bone,
    Cat,
    ShieldAlert,
    Gamepad2,
    HeartPulse,
    BedDouble,
    Star
} from 'lucide-react';
import axios from '@/lib/axiosConfig';
import ProductCard from '@/components/common/ProductCard';
import SmartRecommendations from '@/components/recommendations/SmartRecommendations';

export default function HomePage() {
    const router = useRouter();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [newArrivals, setNewArrivals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                setLoading(true);
                const [catRes, featRes] = await Promise.all([
                    axios.get('/categories'),
                    axios.get('/products/featured')
                ]);
                setCategories(catRes.data.data.categories || []);
                setFeaturedProducts(featRes.data.data.topRated || []);
                setNewArrivals(featRes.data.data.newArrivals || []);
            } catch (err) {
                console.error('Error fetching homepage data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadHomeData();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            router.push(`/products?keyword=${encodeURIComponent(searchKeyword.trim())}`);
        } else {
            router.push('/products');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-linear-to-br from-emerald-900 via-teal-900 to-slate-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [bg-size:16px_16px]"></div>
                
                {/* Glow spheres */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-1/2 -right-24 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Over 5,000+ Vet-Approved Pet Products</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                            Everything Your Pet Loved, <br />
                            <span className="bg-linear-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                                Delivered In Hours.
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-emerald-100/80 max-w-xl font-normal leading-relaxed mx-auto lg:mx-0">
                            Discover organic nutrition, orthopedic bedding, vet-recommended healthcare, and interactive toys from verified manufacturers and suppliers.
                        </p>

                        {/* Search bar inside Hero */}
                        <form onSubmit={handleSearch} className="max-w-xl mx-auto lg:mx-0">
                            <div className="relative flex items-center bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-2xl focus-within:bg-white focus-within:text-gray-900 transition-all">
                                <Search className="w-5 h-5 text-emerald-300 ml-3 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search food, toys, calming beds, medicine..."
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    className="w-full bg-transparent px-3 py-3 text-sm placeholder-white/60 focus:placeholder-gray-400 text-white focus:text-gray-900 outline-none"
                                />
                                <button
                                    type="submit"
                                    className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5"
                                >
                                    Browse Shop
                                </button>
                            </div>
                        </form>

                        {/* Quick filter keywords */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 text-xs text-emerald-200/80">
                            <span className="font-semibold text-white/90">Popular:</span>
                            <Link href="/products?keyword=salmon" className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors">Salmon Kibble</Link>
                            <Link href="/products?category=cat-supplies" className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors">Cat Trees</Link>
                            <Link href="/products?keyword=glucosamine" className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors">Joint Chews</Link>
                            <Link href="/products?keyword=orthopedic" className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors">Memory Beds</Link>
                        </div>
                    </div>

                    {/* Hero Graphic / Featured Showcase */}
                    <div className="lg:col-span-5 relative flex justify-center">
                        <div className="relative w-full max-w-md">
                            <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"
                                    alt="Happy healthy dogs playing"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <div className="flex items-center gap-1 text-amber-300 text-xs font-bold mb-1">
                                        <Star className="w-4 h-4 fill-amber-300" />
                                        <span>4.9 / 5.0 Customer Satisfaction</span>
                                    </div>
                                    <p className="font-bold text-sm">Certified Safe & Non-Toxic Pet Products</p>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-slow">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                                    🐾
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Direct From Suppliers</p>
                                    <p className="text-[11px] text-gray-500">Zero middleman markups</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORIES SHOWCASE */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Curated Collections</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Shop by Category
                        </h2>
                    </div>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 group"
                    >
                        <span>View All Categories</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category._id}
                            href={`/products?category=${category.slug || category._id}`}
                            className="group relative bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 bg-emerald-50 relative group-hover:scale-105 transition-transform">
                                <img
                                    src={category.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80'}
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                                {category.name}
                            </h3>
                            <span className="text-[11px] text-gray-400 mt-0.5">
                                {category.productCount ? `${category.productCount} items` : 'Explore'}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* SMART RECOMMENDATIONS FOR REGISTERED PETS */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <SmartRecommendations
                    title="🐾 Tailored Care For Your Pets"
                    subtitle="Smart nutrition & health recommendations matching your pets' species and medical needs"
                    limit={4}
                />
            </div>

            {/* FEATURED & TOP-RATED PRODUCTS */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>Customer Favorites</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Top-Rated Essentials
                        </h2>
                    </div>
                    <Link
                        href="/products?sort=rating"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 group"
                    >
                        <span>See All Best Sellers</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse space-y-4">
                                <div className="aspect-square bg-gray-200 rounded-xl"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.slice(0, 4).map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* SELLER & SUPPLIER CALLOUT */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="bg-linear-to-r from-teal-800 via-emerald-800 to-teal-900 rounded-3xl text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>

                    <div className="relative z-10 max-w-2xl space-y-5">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 backdrop-blur-md">
                            <Store className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Supplier & Brand Partnership</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                            Grow Your Pet Business With PetCare Hub Marketplace
                        </h2>

                        <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                            List your products directly to thousands of passionate pet owners. Enjoy seamless Cloudinary media storage, real-time inventory management, and fast payouts.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link
                                href="/register"
                                className="bg-white text-emerald-900 hover:bg-emerald-50 text-sm font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all"
                            >
                                Register as a Supplier
                            </Link>
                            <Link
                                href="/supplier/products"
                                className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-bold px-6 py-3.5 rounded-xl backdrop-blur-md transition-all"
                            >
                                Open Supplier Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW ARRIVALS */}
            {newArrivals.length > 0 && (
                <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Fresh In Store</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                New Arrivals
                            </h2>
                        </div>
                        <Link
                            href="/products?sort=newest"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 group"
                        >
                            <span>Explore New Products</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newArrivals.slice(0, 4).map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
