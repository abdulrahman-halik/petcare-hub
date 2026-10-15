'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ProductMobileFiltersProps {
    isOpen: boolean;
    onClose: () => void;
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
    onApply: () => void;
}

export default function ProductMobileFilters({
    isOpen,
    onClose,
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
    onResetFilters,
    onApply
}: ProductMobileFiltersProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <h3 className="font-extrabold text-gray-900 text-base">Filter Products</h3>
                    <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Category</span>
                    <select
                        value={selectedCategory}
                        onChange={(e) => onSelectCategory(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-800"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((c) => (
                            <option key={c._id} value={c.slug || c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Pet Type */}
                <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Pet Type</span>
                    <select
                        value={selectedPetType}
                        onChange={(e) => onSelectPetType(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-800"
                    >
                        {petTypeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Price ($)</span>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => onMinPriceChange(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs outline-none"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => onMaxPriceChange(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs outline-none"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={onInStockToggle}
                            className="w-4 h-4 text-emerald-600 rounded-md"
                        />
                        <span className="text-xs font-bold text-gray-700">In Stock Only</span>
                    </label>
                </div>

                <div className="pt-4 flex gap-3 border-t border-gray-100">
                    {hasActiveFilters && (
                        <button
                            onClick={onResetFilters}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                        >
                            Reset
                        </button>
                    )}
                    <button
                        onClick={onApply}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
