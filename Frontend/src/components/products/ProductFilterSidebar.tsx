'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';

interface ProductFilterSidebarProps {
    categories: any[];
    selectedCategory: string;
    onSelectCategory: (cat: string) => void;
    petTypeOptions: { value: string; label: string }[];
    selectedPetType: string;
    onSelectPetType: (type: string) => void;
    minPrice: string;
    maxPrice: string;
    onMinPriceChange: (v: string) => void;
    onMaxPriceChange: (v: string) => void;
    inStockOnly: boolean;
    onInStockToggle: () => void;
    hasActiveFilters: boolean;
    onResetFilters: () => void;
}

export default function ProductFilterSidebar({
    categories,
    selectedCategory,
    onSelectCategory,
    petTypeOptions,
    selectedPetType,
    onSelectPetType,
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
    inStockOnly,
    onInStockToggle,
    hasActiveFilters,
    onResetFilters
}: ProductFilterSidebarProps) {
    return (
        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 font-black text-gray-900 text-sm">
                        <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                        <span>Filter Products</span>
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={onResetFilters}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                        >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                        </button>
                    )}
                </div>

                {/* Categories */}
                <div className="space-y-3">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                        Categories
                    </span>
                    <div className="space-y-1">
                        <button
                            onClick={() => onSelectCategory('all')}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                                selectedCategory === 'all'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <span>All Categories</span>
                        </button>
                        {categories.map((cat) => {
                            const isSelected = selectedCategory === cat.slug || selectedCategory === cat._id;
                            return (
                                <button
                                    key={cat._id}
                                    onClick={() => onSelectCategory(cat.slug || cat._id)}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                                        isSelected
                                            ? 'bg-emerald-600 text-white shadow-xs'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{cat.name}</span>
                                    {cat.productCount !== undefined && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                            isSelected ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {cat.productCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Pet Type */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                        Target Pet
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                        {petTypeOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => onSelectPetType(opt.value)}
                                className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all text-left truncate ${
                                    selectedPetType === opt.value
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                        Price Range ($)
                    </span>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => onMinPriceChange(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <span className="text-gray-400 text-xs">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => onMaxPriceChange(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>

                {/* In Stock Toggle */}
                <div className="pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={onInStockToggle}
                            className="w-4 h-4 text-emerald-600 rounded-md border-gray-300 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold text-gray-700">In Stock Only</span>
                    </label>
                </div>
            </div>
        </aside>
    );
}
