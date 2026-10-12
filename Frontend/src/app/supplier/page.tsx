'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    Store,
    Package,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    ArrowRight,
    ShoppingBag
} from 'lucide-react';
import axios from '@/lib/axiosConfig';

export default function SupplierOverviewPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [stats, setStats] = useState({
        totalListings: 0,
        activeListings: 0,
        totalStock: 0,
        lowStockCount: 0,
        outOfStockCount: 0
    });
    const [loading, setLoading] = useState(true);

    // Auth Guard
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'supplier' && user.role !== 'admin') {
                router.push('/profile');
            }
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchSupplierStats = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/products/supplier/my-products');
                setStats(res.data.data.stats || {});
            } catch (err) {
                console.error('Failed to load supplier stats:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user && (user.role === 'supplier' || user.role === 'admin')) {
            fetchSupplierStats();
        }
    }, [user]);

    return (
        <div className="space-y-8">
            {/* View Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
                        <Store className="w-4 h-4 text-teal-600" />
                        <span>Supplier Portal</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Inventory Overview & Logistics
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Monitor stock levels, manage your published catalog listings, and track product performance.
                    </p>
                </div>

                <Link
                    href="/supplier/products"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all shrink-0"
                >
                    <Package className="w-4 h-4" />
                    <span>Manage Inventory</span>
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Listings</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{loading ? '...' : stats.totalListings}</h3>
                        <p className="text-[11px] text-gray-500 mt-1">Catalog items</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                        <Package className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active In Store</p>
                        <h3 className="text-2xl font-black text-emerald-700 mt-1">{loading ? '...' : stats.activeListings}</h3>
                        <p className="text-[11px] text-emerald-600 mt-1">Ready for purchase</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Units</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{loading ? '...' : stats.totalStock}</h3>
                        <p className="text-[11px] text-gray-500 mt-1">Warehouse inventory</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Low / Out of Stock</p>
                        <h3 className="text-2xl font-black text-amber-700 mt-1">
                            {loading ? '...' : (stats.lowStockCount || 0) + (stats.outOfStockCount || 0)}
                        </h3>
                        <p className="text-[11px] text-amber-600 mt-1">Replenishment needed</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/supplier/products"
                    className="group bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all space-y-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                            <span>Manage Product Listings</span>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform" />
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Create new listings with Cloudinary multi-image uploads, update prices, adjust inventory quantities, and manage descriptions.
                        </p>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                        <span>Open Inventory Workspace</span>
                    </div>
                </Link>

                <Link
                    href="/products"
                    className="group bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all space-y-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors flex items-center justify-between">
                            <span>View Marketplace Showcase</span>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-transform" />
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Preview how your products look to pet parents and customers across search filters and curated collections.
                        </p>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-xs font-bold text-teal-700">
                        <span>Open Public Catalog</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
