'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import SmartRecommendations from '@/components/recommendations/SmartRecommendations';
import ProductCard from '@/components/common/ProductCard';
import HomeHeroSection from '@/components/home/HomeHeroSection';
import HomeShowcaseSection from '@/components/home/HomeShowcaseSection';
import HomeSupplierBanner from '@/components/home/HomeSupplierBanner';

export default function HomePage() {
    const router = useRouter();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [newArrivals, setNewArrivals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [catalogSearch, setCatalogSearch] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('featured');

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                setLoading(true);
                const [catRes, featRes] = await Promise.all([
                    axios.get('/categories'),
                    axios.get('/products/featured')
                ]);
                setCategories(catRes.data.data.categories || []);
                setFeaturedProducts(featRes.data.data.topRated || []);
                setNewArrivals(featRes.data.data.newArrivals || []);
            } catch (err) {
                console.error('Error fetching homepage data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadHomeData();
    }, []);

    const handleHeroSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            router.push(`/products?keyword=${encodeURIComponent(searchKeyword.trim())}`);
        } else {
            router.push('/products');
        }
    };

    const filteredShowcaseProducts = useMemo(() => {
        let list = [...featuredProducts];

        if (catalogSearch.trim()) {
            const query = catalogSearch.toLowerCase().trim();
            list = list.filter(
                (p) =>
                    p.name?.toLowerCase().includes(query) ||
                    p.description?.toLowerCase().includes(query) ||
                    p.brand?.toLowerCase().includes(query)
            );
        }

        if (selectedCategoryFilter !== 'all') {
            list = list.filter((p) => {
                const catId = p.category?._id || p.category;
                const catSlug = p.category?.slug;
                return catId === selectedCategoryFilter || catSlug === selectedCategoryFilter;
            });
        }

        if (sortBy === 'price-low') {
            list.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortBy === 'price-high') {
            list.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (sortBy === 'rating') {
            list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        }

        return list;
    }, [featuredProducts, catalogSearch, selectedCategoryFilter, sortBy]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">
            {/* Hero Banner with Search */}
            <HomeHeroSection
                searchKeyword={searchKeyword}
                onSearchChange={setSearchKeyword}
                onSearchSubmit={handleHeroSearch}
            />

            {/* Categories Showcase */}
            <section className="py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Curated Collections</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Shop by Category
                            </h2>
                        </div>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 group"
                        >
                            <span>View All Categories</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category._id}
                                href={`/products?category=${category.slug || category._id}`}
                                className="group relative bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1 overflow-hidden"
                            >
                                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 bg-emerald-50 relative group-hover:scale-105 transition-transform">
                                    <img
                                        src={category.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80'}
                                        alt={category.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                                    {category.name}
                                </h3>
                                <span className="text-[11px] text-gray-400 mt-0.5">
                                    {category.productCount ? `${category.productCount} items` : 'Explore'}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Smart Recommendations */}
            <div className="py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <SmartRecommendations
                        title="🐾 Tailored Care For Your Pets"
                        subtitle="Smart nutrition & health recommendations matching your pets' species and medical needs"
                        limit={4}
                    />
                </div>
            </div>

            {/* Showcase with Filter Toolbar & Top Rated Products */}
            <HomeShowcaseSection
                categories={categories}
                loading={loading}
                catalogSearch={catalogSearch}
                onCatalogSearchChange={setCatalogSearch}
                selectedCategoryFilter={selectedCategoryFilter}
                onSelectCategoryFilter={setSelectedCategoryFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                filteredProducts={filteredShowcaseProducts}
            />

            {/* Marketplace Callout */}
            <HomeSupplierBanner />

            {/* Fresh Arrivals Section */}
            {newArrivals.length > 0 && (
                <section className="pb-16 sm:pb-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Fresh In Store</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                    New Arrivals
                                </h2>
                            </div>
                            <Link
                                href="/products?sort=newest"
                                className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 group"
                            >
                                <span>Explore New Products</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {newArrivals.slice(0, 4).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
