'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    Shield,
    Package,
    SlidersHorizontal,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Store,
    Users,
    UserRoundCheck,
    UserRoundX
} from 'lucide-react';
import axios from '@/lib/axiosConfig';

interface ProductItem {
    status?: string;
}

interface AccountSummary {
    totalSuppliers: number;
    activeSuppliers: number;
    deactivatedSuppliers: number;
    totalCustomers: number;
    activeCustomers: number;
    deactivatedCustomers: number;
}

const EMPTY_ACCOUNT_SUMMARY: AccountSummary = {
    totalSuppliers: 0,
    activeSuppliers: 0,
    deactivatedSuppliers: 0,
    totalCustomers: 0,
    activeCustomers: 0,
    deactivatedCustomers: 0
};

export default function AdminOverviewPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [stats, setStats] = useState({
        totalProducts: 0,
        activeProducts: 0,
        flaggedProducts: 0,
        totalCategories: 0
    });
    const [loading, setLoading] = useState(true);
    const [accountSummary, setAccountSummary] = useState<AccountSummary>(EMPTY_ACCOUNT_SUMMARY);

    // Admin Auth Guard
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                router.push('/');
            }
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                setLoading(true);
                const [prodRes, catRes, accountRes] = await Promise.all([
                    axios.get('/products?limit=100'),
                    axios.get('/categories'),
                    axios.get('/admin/accounts/summary')
                ]);

                const prods: ProductItem[] = prodRes.data?.data?.products || [];
                const cats: unknown[] = catRes.data?.data?.categories || [];

                const activeCount = prods.filter((p) => p.status === 'active').length;
                const flaggedCount = prods.filter((p) => p.status === 'flagged').length;

                setStats({
                    totalProducts: prods.length,
                    activeProducts: activeCount,
                    flaggedProducts: flaggedCount,
                    totalCategories: cats.length
                });
                setAccountSummary(accountRes.data?.data?.summary || EMPTY_ACCOUNT_SUMMARY);
            } catch (err) {
                console.error('Failed to load admin stats:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'admin') {
            fetchAdminStats();
        }
    }, [user]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>System Administration</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Admin Command Center
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Oversee marketplace listings, verify vendor products, and manage catalog taxonomy.
                </p>
            </div>

            <section className="space-y-4">
                <div>
                    <h2 className="text-lg font-extrabold text-gray-900">Account overview</h2>
                    <p className="text-sm text-gray-500">Live supplier and customer counts, including lifecycle status.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <AccountStatCard label="Total suppliers" value={accountSummary.totalSuppliers} loading={loading} icon={<Store className="w-5 h-5" />} tone="emerald" />
                    <AccountStatCard label="Active suppliers" value={accountSummary.activeSuppliers} loading={loading} icon={<UserRoundCheck className="w-5 h-5" />} tone="teal" />
                    <AccountStatCard label="Deactivated suppliers" value={accountSummary.deactivatedSuppliers} loading={loading} icon={<UserRoundX className="w-5 h-5" />} tone="rose" />
                    <AccountStatCard label="Total customers" value={accountSummary.totalCustomers} loading={loading} icon={<Users className="w-5 h-5" />} tone="emerald" />
                    <AccountStatCard label="Active customers" value={accountSummary.activeCustomers} loading={loading} icon={<UserRoundCheck className="w-5 h-5" />} tone="teal" />
                    <AccountStatCard label="Deactivated customers" value={accountSummary.deactivatedCustomers} loading={loading} icon={<UserRoundX className="w-5 h-5" />} tone="rose" />
                </div>
            </section>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Listings</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{loading ? '...' : stats.totalProducts}</h3>
                        <p className="text-[11px] text-gray-500 mt-1">Across all suppliers</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Package className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active & Approved</p>
                        <h3 className="text-2xl font-black text-emerald-700 mt-1">{loading ? '...' : stats.activeProducts}</h3>
                        <p className="text-[11px] text-emerald-600 mt-1">Live in marketplace</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Flagged For Review</p>
                        <h3 className="text-2xl font-black text-amber-700 mt-1">{loading ? '...' : stats.flaggedProducts}</h3>
                        <p className="text-[11px] text-amber-600 mt-1">Requires moderation</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categories</p>
                        <h3 className="text-2xl font-black text-cyan-800 mt-1">{loading ? '...' : stats.totalCategories}</h3>
                        <p className="text-[11px] text-cyan-600 mt-1">Taxonomy collections</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                        <SlidersHorizontal className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Quick Management Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/admin/suppliers"
                    className="group bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all space-y-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Store className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                            <span>Supplier Management</span>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform" />
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Register suppliers, review account details, and control account access.</p>
                    </div>
                </Link>

                <Link
                    href="/admin/customers"
                    className="group bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all space-y-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors flex items-center justify-between">
                            <span>Customer Management</span>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-transform" />
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Maintain customer profiles, account statuses, and secure lifecycle controls.</p>
                    </div>
                </Link>

                <Link
                    href="/admin/products"
                    className="group bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all space-y-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                            <span>Product Moderation & Listings</span>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform" />
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Review, approve, flag, or remove vendor product submissions with contextual search and filtering.
                        </p>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                        <span>Open Moderation View</span>
                    </div>
                </Link>

                <Link
                    href="/admin/categories"
                    className="group bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all space-y-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <SlidersHorizontal className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors flex items-center justify-between">
                            <span>Category Management</span>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-transform" />
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Create new categories, upload Cloudinary banner images, and organize shop taxonomy.
                        </p>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-xs font-bold text-teal-700">
                        <span>Manage Categories</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}

function AccountStatCard({
    label,
    value,
    loading,
    icon,
    tone
}: {
    label: string;
    value: number;
    loading: boolean;
    icon: React.ReactNode;
    tone: 'emerald' | 'teal' | 'rose';
}) {
    const toneClass = {
        emerald: 'bg-emerald-50 text-emerald-700',
        teal: 'bg-teal-50 text-teal-700',
        rose: 'bg-rose-50 text-rose-700'
    }[tone];

    return (
        <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs">
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</p>
                <p className="mt-1 text-2xl font-black text-gray-900">{loading ? '…' : value}</p>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClass}`}>{icon}</div>
        </div>
    );
}
