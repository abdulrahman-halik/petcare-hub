'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Sparkles,
    Heart,
    Star,
    ShoppingBag,
    Tag,
    ShieldCheck,
    ChevronRight,
    ArrowRight,
    Info,
    Check
} from 'lucide-react';
import axios from '@/lib/axiosConfig';

interface SmartRecommendationsProps {
    title?: string;
    subtitle?: string;
    selectedPetId?: string;
    limit?: number;
    showViewAll?: boolean;
}

export default function SmartRecommendations({
    title = 'Personalized For Your Pets',
    subtitle = 'Vet-approved nutrition, supplements, and essentials curated from your pet profiles',
    selectedPetId,
    limit = 8,
    showViewAll = true
}: SmartRecommendationsProps) {
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [pets, setPets] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<string>(selectedPetId || 'all');
    const [loading, setLoading] = useState(true);
    const [hasPets, setHasPets] = useState(false);
    const [addedCartIds, setAddedCartIds] = useState<{ [key: string]: boolean }>({});

    // Fetch user pets
    useEffect(() => {
        const loadPets = async () => {
            try {
                const { data } = await axios.get('/pets');
                const userPets = data.data.pets || [];
                setPets(userPets);
                setHasPets(userPets.length > 0);
            } catch (err) {
                // Not authenticated or no pets
                setPets([]);
                setHasPets(false);
            }
        };
        loadPets();
    }, []);

    // Fetch recommendations based on activeTab
    useEffect(() => {
        const fetchRecs = async () => {
            try {
                setLoading(true);
                let endpoint = `/recommendations?limit=${limit}`;
                if (activeTab !== 'all') {
                    endpoint = `/recommendations/pet/${activeTab}?limit=${limit}`;
                }

                const { data } = await axios.get(endpoint);
                setRecommendations(data.data.recommendations || []);
            } catch (err) {
                console.error('Failed to load recommendations:', err);
                setRecommendations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecs();
    }, [activeTab, limit]);

    const handleAddToCartMock = (productId: string) => {
        setAddedCartIds(prev => ({ ...prev, [productId]: true }));
        setTimeout(() => {
            setAddedCartIds(prev => ({ ...prev, [productId]: false }));
        }, 2000);
    };

    return (
        <section className="w-full bg-gradient-to-b from-white via-emerald-50/20 to-white py-10 px-4 sm:px-6 lg:px-8 rounded-3xl border border-emerald-100/60 shadow-xs relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-300/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-6">
                {/* Header & Tabs */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                            <span>AI Smart Recommendation Engine</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            {title}
                        </h2>
                        <p className="text-sm text-gray-600 max-w-2xl mt-1">
                            {subtitle}
                        </p>
                    </div>

                    {showViewAll && (
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 group shrink-0"
                        >
                            <span>Explore Full Catalog</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>

                {/* Pet Switcher Tabs (If customer has pets) */}
                {hasPets && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
                                activeTab === 'all'
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            <span>✨ All My Pets</span>
                            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                                activeTab === 'all' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {pets.length}
                            </span>
                        </button>

                        {pets.map((pet) => (
                            <button
                                key={pet._id}
                                onClick={() => setActiveTab(pet._id)}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
                                    activeTab === pet._id
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }`}
                            >
                                {pet.imageUrl ? (
                                    <img
                                        src={pet.imageUrl}
                                        alt={pet.name}
                                        className="w-5 h-5 rounded-full object-cover border border-white/40"
                                    />
                                ) : (
                                    <span>{pet.species === 'cat' ? '🐈' : pet.species === 'dog' ? '🐕' : '🐾'}</span>
                                )}
                                <span>{pet.name}</span>
                                <span className={`text-[10px] font-normal px-1.5 py-0.5 rounded-md ${
                                    activeTab === pet._id ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {pet.breed || pet.species}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Recommendations Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse space-y-3">
                                <div className="aspect-square bg-gray-200 rounded-xl"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : recommendations.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-xs space-y-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                            🐾
                        </div>
                        <h4 className="font-bold text-gray-900">Add a Pet Profile for Smart Matching</h4>
                        <p className="text-xs text-gray-500 max-w-md mx-auto">
                            Register your pets with age, breed, and health conditions to receive AI-tailored nutrition and wellness recommendations.
                        </p>
                        <Link
                            href="/pets"
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                        >
                            Manage Pet Profiles
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendations.map((item) => {
                            const product = item.product;
                            const isAdded = addedCartIds[product._id];
                            return (
                                <div
                                    key={product._id}
                                    className="group relative bg-white rounded-2xl border border-gray-100/80 hover:border-emerald-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                                >
                                    {/* Top Image & Badges */}
                                    <div className="relative aspect-square w-full overflow-hidden bg-gray-50 p-4">
                                        <img
                                            src={product.imageUrl || product.images?.[0] || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80'}
                                            alt={product.name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Relevance Match Score Pill */}
                                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-extrabold text-emerald-700 border border-emerald-100 shadow-xs flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                                            <span>{item.relevanceScore}% Match</span>
                                        </div>

                                        {/* Pet Name Tag (if matched to pet) */}
                                        {item.matchedPet && (
                                            <div className="absolute top-3 left-3 bg-emerald-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                                <span>🐾 For {item.matchedPet.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                        <div className="space-y-2">
                                            {/* AI Recommendation Reason Banner */}
                                            {item.primaryReason && (
                                                <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-2 text-[11px] font-semibold text-emerald-800 flex items-start gap-1.5 leading-tight">
                                                    <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                                    <span className="line-clamp-2">{item.primaryReason}</span>
                                                </div>
                                            )}

                                            {/* Category & Brand */}
                                            <div className="flex items-center justify-between text-[11px] text-gray-400">
                                                <span className="font-semibold uppercase tracking-wider text-emerald-600">
                                                    {product.brand || product.category?.name || 'PetCare Hub'}
                                                </span>
                                                <div className="flex items-center gap-1 text-amber-500 font-bold">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    <span>{product.rating ? product.rating.toFixed(1) : '4.8'}</span>
                                                </div>
                                            </div>

                                            {/* Product Title */}
                                            <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                                                {product.name}
                                            </h3>
                                        </div>

                                        {/* Price and Action Button */}
                                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                                            <div>
                                                <span className="text-xs text-gray-400 block -mb-0.5">Price</span>
                                                <span className="text-lg font-black text-gray-900">
                                                    ${product.price ? product.price.toFixed(2) : '24.99'}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handleAddToCartMock(product._id)}
                                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                                                    isAdded
                                                        ? 'bg-emerald-700 text-white'
                                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                                                }`}
                                            >
                                                {isAdded ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5" />
                                                        <span>Added!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingBag className="w-3.5 h-3.5" />
                                                        <span>Add to Cart</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
