'use client';

import React from 'react';
import { Package, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

interface SupplierStatsGridProps {
    stats: {
        totalListings?: number;
        activeListings?: number;
        totalStock?: number;
        lowStockCount?: number;
        outOfStockCount?: number;
    };
    loading: boolean;
}

export default function SupplierStatsGrid({ stats, loading }: SupplierStatsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Listings</p>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">{loading ? '...' : (stats.totalListings || 0)}</h3>
                    <p className="text-[11px] text-gray-500 mt-1">Catalog items</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active & Approved</p>
                    <h3 className="text-2xl font-black text-emerald-700 mt-1">{loading ? '...' : (stats.activeListings || 0)}</h3>
                    <p className="text-[11px] text-emerald-600 mt-1">Live in store</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total In-Stock Units</p>
                    <h3 className="text-2xl font-black text-teal-800 mt-1">{loading ? '...' : (stats.totalStock || 0)}</h3>
                    <p className="text-[11px] text-teal-600 mt-1">Units available</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Low Stock Alert</p>
                    <h3 className="text-2xl font-black text-amber-700 mt-1">{loading ? '...' : (stats.lowStockCount || 0)}</h3>
                    <p className="text-[11px] text-amber-600 mt-1">Items ≤ 5 units</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
