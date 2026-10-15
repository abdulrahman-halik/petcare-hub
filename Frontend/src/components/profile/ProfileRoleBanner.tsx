'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, Shield, Store } from 'lucide-react';

interface ProfileRoleBannerProps {
    role: string;
    petsCount: number;
}

export default function ProfileRoleBanner({ role, petsCount }: ProfileRoleBannerProps) {
    if (role === 'customer') {
        return (
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-100 px-3 py-1 rounded-full text-xs font-semibold text-[#047857] border border-emerald-200">
                        <Sparkles className="w-3.5 h-3.5 text-[#047857]" />
                        <span>My Pet Care Hub</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                        {petsCount > 0 ? `${petsCount} Registered Pets` : 'Manage Your Pets & Health Schedules'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                        Access automated vaccination schedules, vet health reminders, and AI smart product recommendations.
                    </p>
                </div>

                <Link
                    href="/pets"
                    className="bg-[#047857] hover:bg-[#065f46] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                    <span>Open Pet Care Hub</span>
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    if (role === 'admin') {
        return (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-100 px-3 py-1 rounded-full text-xs font-semibold text-[#047857] border border-emerald-200">
                        <Shield className="w-3.5 h-3.5 text-[#047857]" />
                        <span>Administrator Console</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                        System Management & Moderation
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                        You have administrator privileges to moderate product listings, manage catalog categories, and review platform metrics.
                    </p>
                </div>

                <Link
                    href="/admin"
                    className="bg-[#047857] hover:bg-[#065f46] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                    <span>Return to Admin Console</span>
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    if (role === 'supplier') {
        return (
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-100 px-3 py-1 rounded-full text-xs font-semibold text-[#047857] border border-emerald-200">
                        <Store className="w-3.5 h-3.5 text-[#047857]" />
                        <span>Supplier Inventory Center</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                        Merchant Profile & Inventory
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                        Manage your pet supply listings, monitor product stock levels, and review incoming consumer orders.
                    </p>
                </div>

                <Link
                    href="/supplier"
                    className="bg-[#047857] hover:bg-[#065f46] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                    <span>Return to Supplier Portal</span>
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return null;
}
