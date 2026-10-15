'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { User } from '@/context/AuthContext';

interface HomeCustomerBannerProps {
    user: User;
}

export default function HomeCustomerBanner({ user }: HomeCustomerBannerProps) {
    return (
        <div className="bg-emerald-50 border-b border-emerald-100 py-2.5 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-950 font-medium">
                    <span className="font-bold text-emerald-800">Welcome back, {user.name}!</span>
                    <span className="text-emerald-300 hidden sm:inline">•</span>
                    <span className="text-emerald-700">Access your registered pets, care reminders &amp; past orders.</span>
                </div>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 self-start sm:self-auto hover:underline"
                >
                    <span>Open Pet Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    );
}
