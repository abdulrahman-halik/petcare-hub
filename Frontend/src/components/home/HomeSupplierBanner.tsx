'use client';

import React from 'react';
import Link from 'next/link';
import { Store } from 'lucide-react';

export default function HomeSupplierBanner() {
    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="bg-emerald-50 border border-emerald-200/90 rounded-3xl text-slate-900 p-8 sm:p-12 relative overflow-hidden shadow-xs">
                    <div className="relative z-10 max-w-2xl space-y-5">
                        <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-xs font-semibold text-[#047857] border border-emerald-200">
                            <Store className="w-3.5 h-3.5 text-[#047857]" />
                            <span>Supplier & Brand Partnership</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug text-slate-900">
                            Grow Your Pet Business With PetCare Hub Marketplace
                        </h2>

                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            List your products directly to thousands of passionate pet owners. Enjoy seamless Cloudinary media storage, real-time inventory management, and fast payouts.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link
                                href="/register"
                                className="bg-[#047857] text-white hover:bg-[#065f46] active:bg-[#064e3b] text-sm font-bold px-6 py-3.5 rounded-xl shadow-xs transition-all"
                            >
                                Register as a Supplier
                            </Link>
                            <Link
                                href="/supplier"
                                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-2xs"
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
