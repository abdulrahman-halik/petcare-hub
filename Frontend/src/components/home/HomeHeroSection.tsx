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
        <section className="relative overflow-hidden bg-emerald-50 text-slate-900 py-16 sm:py-20 border-b border-emerald-100/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-white border border-emerald-200 text-[#047857] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-[#047857]" />
                        <span>Over 5,000+ Vet-Approved Pet Products</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900">
                        Everything Your Pet Loved, <br />
                        <span className="text-[#047857]">
                            Delivered In Hours.
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed mx-auto lg:mx-0">
                        Discover organic nutrition, orthopedic bedding, vet-recommended healthcare, and interactive toys from verified manufacturers and suppliers.
                    </p>

                    {/* Search bar inside Hero */}
                    <form onSubmit={onSearchSubmit} className="max-w-xl mx-auto lg:mx-0">
                        <div className="relative flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm focus-within:border-[#047857] focus-within:ring-2 focus-within:ring-[#047857]/15 transition-all">
                            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search food, toys, calming beds, medicine..."
                                value={searchKeyword}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full bg-transparent px-3 py-3 text-sm placeholder-slate-400 text-slate-900 outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-[#047857] hover:bg-[#065f46] active:bg-[#064e3b] text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
                            >
                                Browse Shop
                            </button>
                        </div>
                    </form>

                    {/* Quick Filter Keyword Pills */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 text-xs text-slate-500">
                        <span className="font-bold text-slate-700">Popular:</span>
                        <Link href="/products?keyword=salmon" className="bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#047857] px-2.5 py-1 rounded-lg transition-colors font-medium">Salmon Kibble</Link>
                        <Link href="/products?category=cat-supplies" className="bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#047857] px-2.5 py-1 rounded-lg transition-colors font-medium">Cat Trees</Link>
                        <Link href="/products?keyword=glucosamine" className="bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#047857] px-2.5 py-1 rounded-lg transition-colors font-medium">Joint Chews</Link>
                        <Link href="/products?keyword=orthopedic" className="bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#047857] px-2.5 py-1 rounded-lg transition-colors font-medium">Memory Beds</Link>
                    </div>
                </div>

                {/* Hero Graphic / Featured Showcase */}
                <div className="lg:col-span-5 relative flex justify-center">
                    <div className="relative w-full max-w-md">
                        <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-xl border-4 border-white relative group">
                            <img
                                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"
                                alt="Happy healthy dogs playing"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200/80 shadow-md">
                                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-0.5">
                                    <Star className="w-4 h-4 fill-amber-500" />
                                    <span>4.9 / 5.0 Customer Satisfaction</span>
                                </div>
                                <p className="font-bold text-xs text-slate-800">Certified Safe & Non-Toxic Pet Products</p>
                            </div>
                        </div>

                        {/* Floating trust badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-4 rounded-2xl shadow-md border border-slate-200 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#047857] border border-emerald-100 flex items-center justify-center font-bold text-lg">
                                🐾
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900">Direct From Suppliers</p>
                                <p className="text-[11px] text-slate-500">Zero middleman markups</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
