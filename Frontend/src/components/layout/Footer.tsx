import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Clock, Heart, Award, Sparkles } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#060b19] text-gray-300 mt-auto border-t border-slate-800/80">
            {/* Features Bar */}
            <div className="border-b border-slate-800/80 bg-[#091124] py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <div className="bg-[#0e162c]/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-slate-700 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">Free Express Delivery</h4>
                                <p className="text-gray-400 text-xs mt-0.5">On all orders above $49</p>
                            </div>
                        </div>

                        <div className="bg-[#0e162c]/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-slate-700 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-teal-950/50 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">Vet-Approved Products</h4>
                                <p className="text-gray-400 text-xs mt-0.5">Strict quality & safety audits</p>
                            </div>
                        </div>

                        <div className="bg-[#0e162c]/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-slate-700 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-blue-950/50 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">Direct From Suppliers</h4>
                                <p className="text-gray-400 text-xs mt-0.5">100% genuine guaranteed</p>
                            </div>
                        </div>

                        <div className="bg-[#0e162c]/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-slate-700 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-indigo-950/50 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">24/7 Pet Support</h4>
                                <p className="text-gray-400 text-xs mt-0.5">Dedicated pet care advisors</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Links */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand overview */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                                <span className="text-xl">🐾</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                                    PetCare<span className="text-emerald-400 font-black">Hub</span>
                                </span>
                                <span className="text-[10px] text-gray-400 -mt-1 font-medium tracking-wider uppercase">
                                    Premium Pet Store
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                            Your comprehensive marketplace for premium pet nutrition, veterinary-grade supplies, interactive toys, and compassionate pet care essentials.
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 pt-2">
                            <span className="inline-flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 px-2.5 py-1 rounded-full">
                                <Sparkles className="w-3 h-3" /> Certified Marketplace
                            </span>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">Shop</h4>
                        <ul className="space-y-2.5 text-sm text-gray-400">
                            <li><Link href="/products" className="hover:text-emerald-400 transition-colors">All Products</Link></li>
                            <li><Link href="/products?category=dog-food-treats" className="hover:text-emerald-400 transition-colors">Dog Nutrition</Link></li>
                            <li><Link href="/products?category=cat-supplies" className="hover:text-emerald-400 transition-colors">Cat Essentials</Link></li>
                            <li><Link href="/products?category=health-medicine" className="hover:text-emerald-400 transition-colors">Health & Wellness</Link></li>
                            <li><Link href="/products?category=toys-play" className="hover:text-emerald-400 transition-colors">Interactive Toys</Link></li>
                        </ul>
                    </div>

                    {/* Suppliers & Partners */}
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">For Sellers</h4>
                        <ul className="space-y-2.5 text-sm text-gray-400">
                            <li><Link href="/register" className="hover:text-emerald-400 transition-colors">Supplier Registration</Link></li>
                            <li><Link href="/supplier/products" className="hover:text-emerald-400 transition-colors">Supplier Portal</Link></li>
                            <li><Link href="/products" className="hover:text-emerald-400 transition-colors">Listing Guidelines</Link></li>
                            <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Partner Sign In</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">Platform</h4>
                        <ul className="space-y-2.5 text-sm text-gray-400">
                            <li><Link href="/profile" className="hover:text-emerald-400 transition-colors">My Account</Link></li>
                            <li><Link href="/products" className="hover:text-emerald-400 transition-colors">Browse Catalog</Link></li>
                            <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Customer Support</Link></li>
                            <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} PetCare Hub Inc. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for happier pets everywhere.
                    </p>
                </div>
            </div>
        </footer>
    );
}
