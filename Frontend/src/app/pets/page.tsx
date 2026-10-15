'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Plus, Sparkles } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import SmartRecommendations from '@/components/recommendations/SmartRecommendations';
import PetRemindersCalendar from '@/components/reminders/PetRemindersCalendar';
import PetCard from '@/components/pets/PetCard';
import PetFormModal from '@/components/pets/PetFormModal';

export default function PetsDashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);
    const [editingPet, setEditingPet] = useState<any | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const fetchPets = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/pets');
            setPets(data.data.pets || []);
        } catch (err) {
            console.error('Failed to load pets:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPets();
        }
    }, [user]);

    const handleOpenAddPet = () => {
        setEditingPet(null);
        setIsPetModalOpen(true);
    };

    const handleOpenEditPet = (pet: any) => {
        setEditingPet(pet);
        setIsPetModalOpen(true);
    };

    const handleDeletePet = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove ${name}'s profile? All associated care reminders will also be deleted.`)) {
            return;
        }
        try {
            await axios.delete(`/pets/${id}`);
            fetchPets();
        } catch (err) {
            console.error('Failed to delete pet:', err);
        }
    };

    if (authLoading || (loading && !pets.length)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="text-center space-y-3">
                    <div className="text-4xl animate-bounce">🐾</div>
                    <p className="text-sm font-semibold text-gray-600">Loading Your Pet Care Hub...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* HERO HEADER */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 text-[#047857] text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-200">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Personalized Pet Care Ecosystem</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
                            Welcome, {user?.name || 'Pet Parent'}! 🐾
                        </h1>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            Manage your pet profiles, schedule preventative health care reminders, and explore AI-curated nutrition tailored to your pets' life stages and medical needs.
                        </p>
                    </div>

                    <button
                        onClick={handleOpenAddPet}
                        className="self-start md:self-center bg-[#047857] hover:bg-[#065f46] text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-sm transition-all hover:scale-105 flex items-center gap-2 shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add New Pet Profile</span>
                    </button>
                </div>

                {/* Quick Stat Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-emerald-200/60">
                    <div className="bg-white p-4 rounded-2xl border border-emerald-100/80 shadow-xs">
                        <span className="text-xs text-slate-500 font-bold block">Registered Pets</span>
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">{pets.length}</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-emerald-100/80 shadow-xs">
                        <span className="text-xs text-slate-500 font-bold block">Health Profiles</span>
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                            {pets.reduce((acc, p) => acc + (p.medicalConditions?.length || 0), 0)}
                        </span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-emerald-100/80 shadow-xs">
                        <span className="text-xs text-slate-500 font-bold block">Species Tracked</span>
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                            {new Set(pets.map(p => p.species)).size}
                        </span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-emerald-100/80 shadow-xs">
                        <span className="text-xs text-slate-500 font-bold block">AI Smart Matches</span>
                        <span className="text-2xl sm:text-3xl font-black text-[#047857]">Active ✨</span>
                    </div>
                </div>
            </div>

            {/* 1. PET PROFILES SECTION */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-[#047857] font-bold text-xs uppercase tracking-wider mb-1">
                            <span>My Family</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Registered Pet Profiles
                        </h2>
                    </div>

                    <button
                        onClick={handleOpenAddPet}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#047857] hover:text-[#065f46] bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Another Pet</span>
                    </button>
                </div>

                {pets.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs space-y-4 max-w-md mx-auto">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#047857] flex items-center justify-center mx-auto text-3xl">
                            🐾
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No Pets Registered Yet</h3>
                        <p className="text-xs text-gray-500">
                            Add your first dog, cat, or bird to unlock tailored nutrition, vaccination schedules, and smart product recommendations.
                        </p>
                        <button
                            onClick={handleOpenAddPet}
                            className="bg-[#047857] hover:bg-[#065f46] text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all"
                        >
                            Register Your First Pet
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pets.map((pet) => (
                            <PetCard
                                key={pet._id}
                                pet={pet}
                                onEdit={handleOpenEditPet}
                                onDelete={handleDeletePet}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* 2. PREVENTATIVE CARE & REMINDERS CALENDAR */}
            <section className="space-y-6 pt-4 border-t border-gray-200/60">
                <PetRemindersCalendar pets={pets} onRemindersChanged={fetchPets} />
            </section>

            {/* 3. AI SMART RECOMMENDATIONS ENGINE */}
            <section className="space-y-6 pt-4 border-t border-gray-200/60">
                <SmartRecommendations
                    title="Veterinarian & AI Curated Product Matches"
                    subtitle="Scientifically selected products aligning with your pets' life stages, breed vulnerabilities, and medical conditions"
                />
            </section>

            {/* MODAL FOR ADD / EDIT PET */}
            <PetFormModal
                isOpen={isPetModalOpen}
                onClose={() => setIsPetModalOpen(false)}
                onSaved={fetchPets}
                editingPet={editingPet}
            />
        </div>
    );
}
