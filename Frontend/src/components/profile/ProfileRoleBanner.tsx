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
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                        <span>My Pet Care Hub</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black">
                        {petsCount > 0 ? `${petsCount} Registered Pets` : 'Manage Your Pets & Health Schedules'}
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-100/80 max-w-md">
                        Access automated vaccination schedules, vet health reminders, and AI smart product recommendations.
                    </p>
                </div>

                <Link
                    href="/pets"
                    className="bg-white text-emerald-900 hover:bg-emerald-50 text-xs sm:text-sm font-extrabold px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                    <span>Open Pet Care Hub</span>
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    if (role === 'admin') {
        return (
            <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-emerald-500/20">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Administrator Console</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black">
                        System Management & Moderation
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 max-w-md">
                        You have administrator privileges to moderate product listings, manage catalog categories, and review platform metrics.
                    </p>
                </div>

                <Link
                    href="/admin"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                    <span>Return to Admin Console</span>
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    if (role === 'supplier') {
        return (
            <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-teal-500/20">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-teal-500/20 px-3 py-1 rounded-full text-xs font-semibold text-teal-300 border border-teal-500/30">
                        <Store className="w-3.5 h-3.5 text-teal-300" />
                        <span>Supplier Inventory Center</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black">
                        Merchant Profile & Inventory
                    </h3>
                    <p className="text-xs sm:text-sm text-teal-100/80 max-w-md">
                        Manage your pet supply listings, monitor product stock levels, and review incoming consumer orders.
                    </p>
                </div>

                <Link
                    href="/supplier"
                    className="bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs sm:text-sm font-extrabold px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                    <span>Return to Supplier Portal</span>
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return null;
}
