'use client';

import React from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Star, ArrowRight, X } from 'lucide-react';
import ProductCard from '@/components/common/ProductCard';

interface HomeShowcaseSectionProps {
    categories: any[];
    loading: boolean;
    catalogSearch: string;
    onCatalogSearchChange: (value: string) => void;
    selectedCategoryFilter: string;
    onSelectCategoryFilter: (value: string) => void;
    sortBy: string;
    onSortByChange: (value: string) => void;
    filteredProducts: any[];
}

export default function HomeShowcaseSection({
    categories,
    loading,
    catalogSearch,
    onCatalogSearchChange,
    selectedCategoryFilter,
    onSelectCategoryFilter,
    sortBy,
    onSortByChange,
    filteredProducts
}: HomeShowcaseSectionProps) {
    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>Customer Favorites</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Top-Rated Essentials
                        </h2>
                    </div>
                    <Link
                        href="/products?sort=rating"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 group"
                    >
                        <span>Explore Full Catalog</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Filter Toolbar */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                placeholder="Filter products by name or brand..."
                                value={catalogSearch}
                                onChange={(e) => onCatalogSearchChange(e.target.value)}
                                className="w-full bg-gray-50 pl-10 pr-9 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                            />
                            {catalogSearch && (
                                <button
                                    onClick={() => onCatalogSearchChange('')}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3 justify-between md:justify-end">
                            <span className="text-xs text-gray-500 font-medium">
                                {filteredProducts.length} items found
                            </span>
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => onSortByChange(e.target.value)}
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="featured">Featured Picks</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                        <button
                            onClick={() => onSelectCategoryFilter('all')}
                            className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                                selectedCategoryFilter === 'all'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            All Collections
                        </button>
                        {categories.map((cat) => {
                            const isActive = selectedCategoryFilter === (cat.slug || cat._id);
                            return (
                                <button
                                    key={cat._id}
                                    onClick={() => onSelectCategoryFilter(isActive ? 'all' : (cat.slug || cat._id))}
                                    className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                                        isActive
                                            ? 'bg-emerald-600 text-white shadow-xs'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse space-y-4">
                                <div className="aspect-square bg-gray-200 rounded-xl"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.slice(0, 8).map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 space-y-3">
                        <p className="text-gray-500 text-sm">No products found matching your current filter.</p>
                        <button
                            onClick={() => {
                                onCatalogSearchChange('');
                                onSelectCategoryFilter('all');
                            }}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
