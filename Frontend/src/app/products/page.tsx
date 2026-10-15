'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Search,
    SlidersHorizontal,
    ChevronRight,
    ArrowUpDown
} from 'lucide-react';
import axios from '@/lib/axiosConfig';
import SmartRecommendations from '@/components/recommendations/SmartRecommendations';
import ProductFilterSidebar from '@/components/products/ProductFilterSidebar';
import ProductMobileFilters from '@/components/products/ProductMobileFilters';
import ProductGridSection from '@/components/products/ProductGridSection';

const PET_TYPE_OPTIONS = [
    { value: 'all', label: 'All Pets' },
    { value: 'dog', label: '🐕 Dogs' },
    { value: 'cat', label: '🐈 Cats' },
    { value: 'bird', label: '🦜 Birds' },
    { value: 'fish', label: '🐠 Fish & Aquatic' },
    { value: 'small-pet', label: '🐹 Small Pets' }
];

function ProductsCatalogContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [keyword, setKeyword] = useState(searchParams?.get('keyword') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || 'all');
    const [selectedPetType, setSelectedPetType] = useState(searchParams?.get('petType') || 'all');
    const [minPrice, setMinPrice] = useState(searchParams?.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams?.get('maxPrice') || '');
    const [inStockOnly, setInStockOnly] = useState(searchParams?.get('inStock') === 'true');
    const [sortBy, setSortBy] = useState(searchParams?.get('sort') || 'newest');
    const [currentPage, setCurrentPage] = useState(Number(searchParams?.get('page')) || 1);

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

    // Synchronize catalog states when URL search parameters change
    useEffect(() => {
        const urlKeyword = searchParams?.get('keyword') || '';
        const urlCategory = searchParams?.get('category') || 'all';
        const urlPetType = searchParams?.get('petType') || 'all';
        const urlMinPrice = searchParams?.get('minPrice') || '';
        const urlMaxPrice = searchParams?.get('maxPrice') || '';
        const urlInStock = searchParams?.get('inStock') === 'true';
        const urlSort = searchParams?.get('sort') || 'newest';
        const urlPage = Number(searchParams?.get('page')) || 1;

        setKeyword(urlKeyword);
        setSelectedCategory(urlCategory);
        setSelectedPetType(urlPetType);
        setMinPrice(urlMinPrice);
        setMaxPrice(urlMaxPrice);
        setInStockOnly(urlInStock);
        setSortBy(urlSort);
        setCurrentPage(urlPage);
    }, [searchParams]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        const params = new URLSearchParams(searchParams?.toString() || '');
        if (keyword.trim()) {
            params.set('keyword', keyword.trim());
        } else {
            params.delete('keyword');
        }
        params.set('page', '1');
        router.push(`/products?${params.toString()}`);
    };

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

    return (
        <div className="min-h-screen bg-gray-50/50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header & Controls */}
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

                {/* Recommendations */}
                {currentPage === 1 && !keyword && (
                    <SmartRecommendations
                        title="✨ Recommended For You"
                        subtitle="Tailored results automatically matched with your registered pet metrics"
                        limit={4}
                        showViewAll={false}
                    />
                )}

                {/* Main Content Layout */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <ProductFilterSidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={(cat) => {
                            setSelectedCategory(cat);
                            setCurrentPage(1);
                        }}
                        petTypeOptions={PET_TYPE_OPTIONS}
                        selectedPetType={selectedPetType}
                        onSelectPetType={(type) => {
                            setSelectedPetType(type);
                            setCurrentPage(1);
                        }}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        onMinPriceChange={setMinPrice}
                        onMaxPriceChange={setMaxPrice}
                        inStockOnly={inStockOnly}
                        onInStockToggle={() => setInStockOnly(!inStockOnly)}
                        hasActiveFilters={hasActiveFilters}
                        onResetFilters={handleResetFilters}
                    />

                    {/* Product Grid Area */}
                    <main className="flex-1 w-full space-y-6">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                placeholder="Search products by brand, title, or keywords..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full bg-white text-sm font-medium rounded-2xl pl-11 pr-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs transition-all"
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
                        </form>

                        <ProductGridSection
                            loading={loading}
                            products={products}
                            pagination={pagination}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            hasActiveFilters={hasActiveFilters}
                            onResetFilters={handleResetFilters}
                        />
                    </main>
                </div>
            </div>

            <ProductMobileFilters
                isOpen={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                }}
                petTypeOptions={PET_TYPE_OPTIONS}
                selectedPetType={selectedPetType}
                onSelectPetType={(type) => {
                    setSelectedPetType(type);
                    setCurrentPage(1);
                }}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                inStockOnly={inStockOnly}
                onInStockToggle={() => setInStockOnly(!inStockOnly)}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={handleResetFilters}
                onApply={() => setIsMobileFilterOpen(false)}
            />
        </div>
    );
}

export default function ProductsCatalogPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                    <div className="text-center space-y-3">
                        <div className="text-3xl animate-bounce">🐾</div>
                        <p className="text-sm font-semibold text-gray-600">Loading PetCare Catalog...</p>
                    </div>
                </div>
            }
        >
            <ProductsCatalogContent />
        </Suspense>
    );
}
