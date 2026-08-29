'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Search,
    SlidersHorizontal,
    X,
    ChevronRight,
    ArrowUpDown,
    Check,
    RotateCcw
} from 'lucide-react';
import axios from '@/lib/axiosConfig';
import ProductCard from '@/components/common/ProductCard';

function ProductsCatalogContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Query states with safe optional chaining
    const [keyword, setKeyword] = useState(searchParams?.get('keyword') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || 'all');
    const [selectedPetType, setSelectedPetType] = useState(searchParams?.get('petType') || 'all');
    const [minPrice, setMinPrice] = useState(searchParams?.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams?.get('maxPrice') || '');
    const [inStockOnly, setInStockOnly] = useState(searchParams?.get('inStock') === 'true');
    const [sortBy, setSortBy] = useState(searchParams?.get('sort') || 'newest');
    const [currentPage, setCurrentPage] = useState(Number(searchParams?.get('page')) || 1);

    // Data states
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        totalProducts: 0,
        currentPage: 1,
        totalPages: 1,
        hasMore: false
    });
    const [loading, setLoading] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Fetch Categories once
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/categories');
                setCategories(data.data.categories || []);
            } catch (err) {
                console.error('Error loading categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Products function
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const params: any = {
                page: currentPage,
                limit: 12,
                sort: sortBy
            };

            if (keyword.trim()) params.keyword = keyword.trim();
            if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
            if (selectedPetType && selectedPetType !== 'all') params.petType = selectedPetType;
            if (minPrice !== '') params.minPrice = minPrice;
            if (maxPrice !== '') params.maxPrice = maxPrice;
            if (inStockOnly) params.inStock = true;

            const { data } = await axios.get('/products', { params });
            setProducts(data.data.products || []);
            if (data.data.pagination) {
                setPagination(data.data.pagination);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }, [keyword, selectedCategory, selectedPetType, minPrice, maxPrice, inStockOnly, sortBy, currentPage]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Handle search bar submit
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProducts();
    };

    // Reset filters
    const handleResetFilters = () => {
        setKeyword('');
        setSelectedCategory('all');
        setSelectedPetType('all');
        setMinPrice('');
        setMaxPrice('');
        setInStockOnly(false);
        setSortBy('newest');
        setCurrentPage(1);
        router.push('/products');
    };

    const hasActiveFilters = 
        keyword !== '' || 
        selectedCategory !== 'all' || 
        selectedPetType !== 'all' || 
        minPrice !== '' || 
        maxPrice !== '' || 
        inStockOnly;

    const petTypeOptions = [
        { value: 'all', label: 'All Pets' },
        { value: 'dog', label: '🐕 Dogs' },
        { value: 'cat', label: '🐈 Cats' },
        { value: 'bird', label: '🦜 Birds' },
        { value: 'fish', label: '🐠 Fish & Aquatic' },
        { value: 'small-pet', label: '🐹 Small Pets' },
        { value: 'reptile', label: '🦎 Reptiles' }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Breadcrumbs & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <span>Home</span>
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                            <span className="font-semibold text-emerald-600">Product Catalog</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Explore Pet Products
                        </h1>
                    </div>

                    {/* Results count & Sort dropdown */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="lg:hidden inline-flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                            Filters {hasActiveFilters && '• Active'}
                        </button>

                        <div className="relative flex items-center bg-white rounded-xl border border-gray-200 px-3 py-1.5 shadow-xs">
                            <ArrowUpDown className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer pr-2"
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="rating">Highest Rated</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* DESKTOP SIDEBAR FILTER */}
                    <aside className="hidden lg:block bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-6 sticky top-24">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
                                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                                <span>Filter Products</span>
                            </div>
                            {hasActiveFilters && (
                                <button
                                    onClick={handleResetFilters}
                                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                                >
                                    <RotateCcw className="w-3 h-3" /> Reset
                                </button>
                            )}
                        </div>

                        {/* Search keyword inside sidebar */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Keyword Search
                            </label>
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="w-full bg-gray-50 text-sm rounded-xl pl-9 pr-3 py-2 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                            </form>
                        </div>

                        {/* Category Filter */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                                Categories
                            </label>
                            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setCurrentPage(1);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                                        selectedCategory === 'all'
                                            ? 'bg-emerald-50 text-emerald-700 font-bold'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>All Categories</span>
                                    {selectedCategory === 'all' && <Check className="w-4 h-4 text-emerald-600" />}
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => {
                                            setSelectedCategory(cat.slug || cat._id);
                                            setCurrentPage(1);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                                            selectedCategory === cat.slug || selectedCategory === cat._id
                                                ? 'bg-emerald-50 text-emerald-700 font-bold'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="truncate">{cat.name}</span>
                                        {cat.productCount !== undefined && (
                                            <span className="text-xs text-gray-400 ml-2 shrink-0">
                                                {cat.productCount}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pet Type Filter */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                                Pet Type
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {petTypeOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setSelectedPetType(opt.value);
                                            setCurrentPage(1);
                                        }}
                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                                            selectedPetType === opt.value
                                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                                Price Range ($)
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => {
                                        setMinPrice(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full bg-gray-50 text-sm rounded-xl px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    min="0"
                                />
                                <span className="text-gray-400 font-bold">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => {
                                        setMaxPrice(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full bg-gray-50 text-sm rounded-xl px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Stock Availability */}
                        <div className="pt-4 border-t border-gray-100">
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => {
                                        setInStockOnly(e.target.checked);
                                        setCurrentPage(1);
                                    }}
                                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                />
                                <span className="text-sm font-semibold text-gray-700">In Stock Only</span>
                            </label>
                        </div>
                    </aside>

                    {/* PRODUCT LISTINGS CONTENT */}
                    <main className="lg:col-span-3 space-y-6">
                        {/* Active Filter Chips */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-2 bg-white p-3.5 rounded-xl border border-gray-100 shadow-xs">
                                <span className="text-xs font-semibold text-gray-500">Active Filters:</span>

                                {keyword && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">
                                        Search: "{keyword}"
                                        <button onClick={() => setKeyword('')}><X className="w-3 h-3" /></button>
                                    </span>
                                )}

                                {selectedCategory !== 'all' && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">
                                        Category: {categories.find(c => c.slug === selectedCategory || c._id === selectedCategory)?.name || selectedCategory}
                                        <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
                                    </span>
                                )}

                                {selectedPetType !== 'all' && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">
                                        Pet: {selectedPetType}
                                        <button onClick={() => setSelectedPetType('all')}><X className="w-3 h-3" /></button>
                                    </span>
                                )}

                                {(minPrice !== '' || maxPrice !== '') && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">
                                        Price: ${minPrice || '0'} - ${maxPrice || '∞'}
                                        <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}><X className="w-3 h-3" /></button>
                                    </span>
                                )}

                                {inStockOnly && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">
                                        In Stock
                                        <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
                                    </span>
                                )}

                                <button
                                    onClick={handleResetFilters}
                                    className="text-xs text-rose-600 hover:underline font-semibold ml-auto"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Product Grid / Loading / Empty States */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse space-y-4">
                                        <div className="aspect-square bg-gray-200 rounded-xl"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs space-y-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                                    🐾
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">No products matched your search</h3>
                                <p className="text-sm text-gray-500 max-w-md mx-auto">
                                    Try adjusting your keyword, removing price bounds, or clearing filters to see more pet essentials.
                                </p>
                                <button
                                    onClick={handleResetFilters}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-8">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={pagination.currentPage === 1}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors ${
                                            pagination.currentPage === page
                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* MOBILE FILTER MODAL DRAWER */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)}></div>
                    <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Categories */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((c) => (
                                        <option key={c._id} value={c.slug || c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Pet Type */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Pet Type</label>
                                <select
                                    value={selectedPetType}
                                    onChange={(e) => {
                                        setSelectedPetType(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm"
                                >
                                    {petTypeOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Price Range</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-sm"
                                    />
                                </div>
                            </div>

                            {/* In Stock */}
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="w-4 h-4 text-emerald-600 rounded"
                                />
                                <span className="text-sm font-semibold text-gray-700">In Stock Only</span>
                            </label>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={handleResetFilters}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold"
                            >
                                Show Results
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ProductsCatalogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="text-center space-y-3">
                    <div className="text-3xl animate-bounce">🐾</div>
                    <p className="text-sm font-semibold text-gray-600">Loading PetCare Catalog...</p>
                </div>
            </div>
        }>
            <ProductsCatalogContent />
        </Suspense>
    );
}
