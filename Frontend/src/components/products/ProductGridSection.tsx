'use client';

import React from 'react';
import ProductCard from '@/components/common/ProductCard';
import { RotateCcw } from 'lucide-react';

interface ProductGridSectionProps {
    loading: boolean;
    products: any[];
    pagination: {
        totalProducts: number;
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
    };
    currentPage: number;
    onPageChange: (page: number) => void;
    hasActiveFilters: boolean;
    onResetFilters: () => void;
}

export default function ProductGridSection({
    loading,
    products,
    pagination,
    currentPage,
    onPageChange,
    hasActiveFilters,
    onResetFilters
}: ProductGridSectionProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 animate-pulse space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-2xl w-full" />
                        <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                        <div className="h-4 bg-gray-100 rounded-full w-1/3" />
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-4">
                <div className="text-5xl">🔍</div>
                <h3 className="text-lg font-bold text-gray-900">No matching products found</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    Try adjusting your search criteria, clearing selected filters, or exploring another category.
                </p>
                {hasActiveFilters && (
                    <button
                        onClick={onResetFilters}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-xs"
                    >
                        Previous
                    </button>
                    <span className="text-xs font-bold text-gray-500 px-3">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                        disabled={currentPage >= pagination.totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-xs"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
