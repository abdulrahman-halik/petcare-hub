'use client';

import React from 'react';
import Link from 'next/link';
import { Store } from 'lucide-react';

export default function HomeSupplierBanner() {
    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
                                href="/supplier"
                                className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-bold px-6 py-3.5 rounded-xl backdrop-blur-md transition-all"
                            >
                                Open Supplier Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
