'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Sparkles, Star } from 'lucide-react';

interface HomeHeroSectionProps {
    searchKeyword: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
}

export default function HomeHeroSection({
    searchKeyword,
    onSearchChange,
    onSearchSubmit
}: HomeHeroSectionProps) {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-emerald-900 via-teal-900 to-slate-950 text-white py-16 sm:py-20">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [bg-size:16px_16px]"></div>
            
            {/* Glow ambient spheres */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 -right-24 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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
                    <form onSubmit={onSearchSubmit} className="max-w-xl mx-auto lg:mx-0">
                        <div className="relative flex items-center bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-2xl focus-within:bg-white focus-within:text-gray-900 transition-all">
                            <Search className="w-5 h-5 text-emerald-300 ml-3 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search food, toys, calming beds, medicine..."
                                value={searchKeyword}
                                onChange={(e) => onSearchChange(e.target.value)}
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

                    {/* Quick Filter Keyword Pills */}
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

                        {/* Floating trust badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
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
    );
}
