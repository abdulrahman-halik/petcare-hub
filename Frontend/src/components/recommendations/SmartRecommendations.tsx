'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import RecommendationCard from './RecommendationCard';

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
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [pets, setPets] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<string>(selectedPetId || 'all');
    const [loading, setLoading] = useState(true);
    const [hasPets, setHasPets] = useState(false);
    const [addedCartIds, setAddedCartIds] = useState<{ [key: string]: boolean }>({});
    const [addingCartId, setAddingCartId] = useState<string | null>(null);

    // Fetch user pets only if authenticated
    useEffect(() => {
        if (!user) {
            setPets([]);
            setHasPets(false);
            return;
        }

        const loadPets = async () => {
            try {
                const { data } = await axios.get('/pets');
                const userPets = data.data.pets || [];
                setPets(userPets);
                setHasPets(userPets.length > 0);
            } catch (err) {
                setPets([]);
                setHasPets(false);
            }
        };
        loadPets();
    }, [user]);

    // Fetch recommendations based on activeTab
    useEffect(() => {
        const fetchRecs = async () => {
            try {
                setLoading(true);
                const endpoint = activeTab !== 'all'
                    ? `/recommendations/pet/${activeTab}?limit=${limit}`
                    : `/recommendations?limit=${limit}`;

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

    // Real Cart Integration
    const handleAddToCart = async (productId: string) => {
        if (!user) {
            window.location.href = '/login';
            return;
        }
        try {
            setAddingCartId(productId);
            await addToCart(productId, 1);
            setAddedCartIds(prev => ({ ...prev, [productId]: true }));
            setTimeout(() => {
                setAddedCartIds(prev => ({ ...prev, [productId]: false }));
            }, 2000);
        } catch (err) {
            console.error('Failed to add recommendation to cart:', err);
        } finally {
            setAddingCartId(null);
        }
    };

    return (
        <section className="w-full bg-linear-to-b from-white via-emerald-50/20 to-white py-10 px-4 sm:px-6 lg:px-8 rounded-3xl border border-emerald-100/60 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-300/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-6">
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
                                    <img src={pet.imageUrl} alt={pet.name} className="w-5 h-5 rounded-full object-cover border border-white/40" />
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
                        <Link href="/pets" className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all">
                            Manage Pet Profiles
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendations.map((item) => (
                            <RecommendationCard
                                key={item.product._id}
                                item={item}
                                isAdded={!!addedCartIds[item.product._id]}
                                isAdding={addingCartId === item.product._id}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
