'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    Plus,
    Sparkles,
    Calendar,
    HeartPulse,
    Activity,
    Trash2,
    Edit3,
    Upload,
    Check,
    X,
    Shield,
    Tag,
    ChevronRight,
    Search,
    AlertCircle,
    Info
} from 'lucide-react';
import axios from '@/lib/axiosConfig';
import SmartRecommendations from '@/components/recommendations/SmartRecommendations';
import PetRemindersCalendar from '@/components/reminders/PetRemindersCalendar';

export default function PetsDashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state for Add/Edit Pet
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);
    const [editingPet, setEditingPet] = useState<any | null>(null);

    // Form inputs
    const [formName, setFormName] = useState('');
    const [formSpecies, setFormSpecies] = useState('dog');
    const [formBreed, setFormBreed] = useState('');
    const [formAge, setFormAge] = useState('');
    const [formBirthDate, setFormBirthDate] = useState('');
    const [formGender, setFormGender] = useState('male');
    const [formWeight, setFormWeight] = useState('');
    const [formActivityLevel, setFormActivityLevel] = useState('moderate');
    const [formMedicalConditions, setFormMedicalConditions] = useState<string[]>([]);
    const [conditionInput, setConditionInput] = useState('');
    const [formAllergies, setFormAllergies] = useState<string[]>([]);
    const [allergyInput, setAllergyInput] = useState('');
    const [formDietaryPreferences, setFormDietaryPreferences] = useState<string[]>([]);
    const [dietInput, setDietInput] = useState('');
    const [formMicrochipNumber, setFormMicrochipNumber] = useState('');
    const [formImageUrl, setFormImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSubmitting, setFormSubmitting] = useState(false);

    // Common presets for quick condition selection
    const commonConditions = [
        'Joint Stiffness / Arthritis',
        'Sensitive Digestion / Stomach',
        'Skin & Coat Dryness',
        'Dental Plaque / Bad Breath',
        'Anxiety / Stress',
        'Weight Management',
        'Puppy Teething / Growth',
        'Hairballs'
    ];

    const commonDietaryPrefs = [
        'Grain-Free',
        'High-Protein',
        'Raw Food',
        'Wet Gravy Only',
        'Hypoallergenic'
    ];

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Fetch pets
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

    // Handle Open Add Modal
    const handleOpenAddPet = () => {
        setEditingPet(null);
        setFormName('');
        setFormSpecies('dog');
        setFormBreed('');
        setFormAge('1');
        setFormBirthDate('');
        setFormGender('male');
        setFormWeight('5');
        setFormActivityLevel('moderate');
        setFormMedicalConditions([]);
        setFormAllergies([]);
        setFormDietaryPreferences([]);
        setFormMicrochipNumber('');
        setFormImageUrl('');
        setFormError('');
        setIsPetModalOpen(true);
    };

    // Handle Open Edit Modal
    const handleOpenEditPet = (pet: any) => {
        setEditingPet(pet);
        setFormName(pet.name);
        setFormSpecies(pet.species);
        setFormBreed(pet.breed || '');
        setFormAge(pet.age !== undefined ? String(pet.age) : '1');
        setFormBirthDate(pet.birthDate ? new Date(pet.birthDate).toISOString().split('T')[0] : '');
        setFormGender(pet.gender || 'unknown');
        setFormWeight(pet.weight !== undefined ? String(pet.weight) : '5');
        setFormActivityLevel(pet.activityLevel || 'moderate');
        setFormMedicalConditions(pet.medicalConditions || []);
        setFormAllergies(pet.allergies || []);
        setFormDietaryPreferences(pet.dietaryPreferences || []);
        setFormMicrochipNumber(pet.microchipNumber || '');
        setFormImageUrl(pet.imageUrl || '');
        setFormError('');
        setIsPetModalOpen(true);
    };

    // Image upload handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append('image', file);
            formData.append('folder', 'petcare-hub/pets');

            const { data } = await axios.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.data?.url) {
                setFormImageUrl(data.data.url);
            }
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Failed to upload pet photo');
        } finally {
            setUploadingImage(false);
        }
    };

    // Tag management helpers
    const addCondition = (condition: string) => {
        if (condition && !formMedicalConditions.includes(condition)) {
            setFormMedicalConditions([...formMedicalConditions, condition]);
        }
        setConditionInput('');
    };

    const removeCondition = (condition: string) => {
        setFormMedicalConditions(formMedicalConditions.filter(c => c !== condition));
    };

    const addAllergy = (allergy: string) => {
        if (allergy && !formAllergies.includes(allergy)) {
            setFormAllergies([...formAllergies, allergy]);
        }
        setAllergyInput('');
    };

    const removeAllergy = (allergy: string) => {
        setFormAllergies(formAllergies.filter(a => a !== allergy));
    };

    const addDiet = (diet: string) => {
        if (diet && !formDietaryPreferences.includes(diet)) {
            setFormDietaryPreferences([...formDietaryPreferences, diet]);
        }
        setDietInput('');
    };

    const removeDiet = (diet: string) => {
        setFormDietaryPreferences(formDietaryPreferences.filter(d => d !== diet));
    };

    // Save Pet Form
    const handleSavePet = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setFormSubmitting(true);

        try {
            const payload = {
                name: formName.trim(),
                species: formSpecies,
                breed: formBreed.trim() || 'Mixed / Other',
                age: Number(formAge) || 1,
                birthDate: formBirthDate ? formBirthDate : undefined,
                gender: formGender,
                weight: Number(formWeight) || 5,
                activityLevel: formActivityLevel,
                medicalConditions: formMedicalConditions,
                allergies: formAllergies,
                dietaryPreferences: formDietaryPreferences,
                microchipNumber: formMicrochipNumber.trim(),
                imageUrl: formImageUrl
            };

            if (editingPet) {
                await axios.put(`/pets/${editingPet._id}`, payload);
            } else {
                await axios.post('/pets', payload);
            }

            setIsPetModalOpen(false);
            fetchPets();
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Failed to save pet profile');
        } finally {
            setFormSubmitting(false);
        }
    };

    // Delete Pet
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

    const getSpeciesEmoji = (species: string) => {
        switch (species) {
            case 'dog': return '🐕';
            case 'cat': return '🐈';
            case 'bird': return '🦜';
            case 'fish': return '🐠';
            case 'small-pet': return '🐹';
            case 'reptile': return '🦎';
            default: return '🐾';
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
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* HERO HEADER */}
                <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-2xl">
                            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-400/30 backdrop-blur-md">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Personalized Pet Care Ecosystem</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                                Welcome, {user?.name || 'Pet Parent'}! 🐾
                            </h1>
                            <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed">
                                Manage your pet profiles, schedule preventative health care reminders, and explore AI-curated nutrition tailored to your pets' life stages and medical needs.
                            </p>
                        </div>

                        <button
                            onClick={handleOpenAddPet}
                            className="self-start md:self-center bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-gray-950 font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 flex items-center gap-2 shrink-0"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add New Pet Profile</span>
                        </button>
                    </div>

                    {/* Quick Stat Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
                        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                            <span className="text-xs text-emerald-300 font-bold block">Registered Pets</span>
                            <span className="text-2xl sm:text-3xl font-black">{pets.length}</span>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                            <span className="text-xs text-emerald-300 font-bold block">Health Profiles</span>
                            <span className="text-2xl sm:text-3xl font-black">
                                {pets.reduce((acc, p) => acc + (p.medicalConditions?.length || 0), 0)}
                            </span>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                            <span className="text-xs text-emerald-300 font-bold block">Species Tracked</span>
                            <span className="text-2xl sm:text-3xl font-black">
                                {new Set(pets.map(p => p.species)).size}
                            </span>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                            <span className="text-xs text-emerald-300 font-bold block">AI Smart Matches</span>
                            <span className="text-2xl sm:text-3xl font-black">Active ✨</span>
                        </div>
                    </div>
                </div>

                {/* 1. PET PROFILES SECTION */}
                <section className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                                <span>My Family</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Registered Pet Profiles
                            </h2>
                        </div>

                        <button
                            onClick={handleOpenAddPet}
                            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Another Pet</span>
                        </button>
                    </div>

                    {pets.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs space-y-4 max-w-md mx-auto">
                            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                                🐾
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No Pets Registered Yet</h3>
                            <p className="text-xs text-gray-500">
                                Add your first dog, cat, or bird to unlock tailored nutrition, vaccination schedules, and smart product recommendations.
                            </p>
                            <button
                                onClick={handleOpenAddPet}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all"
                            >
                                Register Your First Pet
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pets.map((pet) => (
                                <div
                                    key={pet._id}
                                    className="bg-white rounded-3xl border border-gray-100/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                                >
                                    {/* Card Header with Photo */}
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-emerald-50 border-2 border-emerald-100 shrink-0 relative group-hover:scale-105 transition-transform">
                                                    {pet.imageUrl ? (
                                                        <img
                                                            src={pet.imageUrl}
                                                            alt={pet.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-3xl">
                                                            {getSpeciesEmoji(pet.species)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-extrabold text-xl text-gray-900">
                                                            {pet.name}
                                                        </h3>
                                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            {pet.gender === 'male' ? '♂ Male' : pet.gender === 'female' ? '♀ Female' : '🐾'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-semibold text-gray-500">
                                                        {pet.breed || pet.species} • {getSpeciesEmoji(pet.species)} {pet.species.toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleOpenEditPet(pet)}
                                                    className="p-2 rounded-xl text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                                    title="Edit Pet"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePet(pet._id, pet.name)}
                                                    className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                    title="Delete Pet"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Pet Metrics Pills */}
                                        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                                            <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                                <span className="text-[10px] text-gray-400 block font-semibold">Age</span>
                                                <span className="font-bold text-gray-800">
                                                    {pet.age < 1 ? `${Math.round(pet.age * 12)} mos` : `${pet.age} yrs`}
                                                </span>
                                            </div>
                                            <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                                <span className="text-[10px] text-gray-400 block font-semibold">Weight</span>
                                                <span className="font-bold text-gray-800">{pet.weight || '5'} kg</span>
                                            </div>
                                            <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                                <span className="text-[10px] text-gray-400 block font-semibold">Activity</span>
                                                <span className="font-bold text-gray-800 capitalize">{pet.activityLevel || 'Moderate'}</span>
                                            </div>
                                        </div>

                                        {/* Medical Conditions Chips */}
                                        {pet.medicalConditions && pet.medicalConditions.length > 0 && (
                                            <div className="space-y-1.5 pt-2">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                                    Health Profile & Conditions
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {pet.medicalConditions.map((cond: string, idx: number) => (
                                                        <span
                                                            key={idx}
                                                            className="text-[11px] font-semibold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-200"
                                                        >
                                                            🩺 {cond}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Dietary & Allergies */}
                                        {(pet.dietaryPreferences?.length > 0 || pet.allergies?.length > 0) && (
                                            <div className="space-y-1.5 pt-1">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {pet.dietaryPreferences?.map((diet: string, idx: number) => (
                                                        <span
                                                            key={`diet-${idx}`}
                                                            className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200"
                                                        >
                                                            🥣 {diet}
                                                        </span>
                                                    ))}
                                                    {pet.allergies?.map((all: string, idx: number) => (
                                                        <span
                                                            key={`all-${idx}`}
                                                            className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200"
                                                        >
                                                            🚫 {all}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {pet.microchipNumber && (
                                            <p className="text-[11px] text-gray-400 pt-1 font-mono">
                                                Microchip: <span className="text-gray-600 font-semibold">{pet.microchipNumber}</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Card Footer */}
                                    <div className="p-4 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                                            <span>AI Recommendations Active</span>
                                        </span>
                                        <button
                                            onClick={() => handleOpenEditPet(pet)}
                                            className="text-xs font-bold text-gray-700 hover:text-emerald-700 flex items-center gap-1"
                                        >
                                            <span>Edit Profile</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 2. PET CARE CALENDAR & REMINDERS */}
                <PetRemindersCalendar pets={pets} onRefreshPets={fetchPets} />

                {/* 3. SMART PRODUCT RECOMMENDATIONS */}
                <SmartRecommendations
                    title="Smart Product Recommendations For Your Pets"
                    subtitle="Personalized matching algorithm analyzing your registered pets' ages, species, and medical conditions"
                />
            </div>

            {/* ADD / EDIT PET MODAL */}
            {isPetModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <h3 className="text-xl font-black text-gray-900">
                                {editingPet ? `Edit ${editingPet.name}'s Profile` : 'Register New Pet Profile'}
                            </h3>
                            <button
                                onClick={() => setIsPetModalOpen(false)}
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {formError && (
                            <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSavePet} className="space-y-6 mt-6">
                            {/* Pet Photo Upload */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Pet Photo
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center shrink-0 relative">
                                        {formImageUrl ? (
                                            <img
                                                src={formImageUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-3xl">{getSpeciesEmoji(formSpecies)}</span>
                                        )}
                                        {uploadingImage && (
                                            <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xs font-bold">
                                                Uploading...
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2 flex-1">
                                        <label className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 cursor-pointer shadow-xs">
                                            <Upload className="w-4 h-4 text-emerald-600" />
                                            <span>{uploadingImage ? 'Uploading...' : 'Choose Image File'}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={uploadingImage}
                                            />
                                        </label>
                                        <p className="text-[11px] text-gray-400">
                                            Supports JPG, PNG, WEBP up to 10MB.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Species Selector */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Species *
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {[
                                        { value: 'dog', label: '🐕 Dog' },
                                        { value: 'cat', label: '🐈 Cat' },
                                        { value: 'bird', label: '🦜 Bird' },
                                        { value: 'fish', label: '🐠 Fish' },
                                        { value: 'small-pet', label: '🐹 Small Pet' },
                                        { value: 'reptile', label: '🦎 Reptile' },
                                        { value: 'other', label: '🐾 Other' }
                                    ].map((s) => (
                                        <button
                                            key={s.value}
                                            type="button"
                                            onClick={() => setFormSpecies(s.value)}
                                            className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                                                formSpecies === s.value
                                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name & Breed */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Pet Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Bailey, Milo, Luna"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Breed
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Golden Retriever, Persian, Ragdoll"
                                        value={formBreed}
                                        onChange={(e) => setFormBreed(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Age, Weight, Gender */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Age (Years / Decimals) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="e.g. 0.8 or 3"
                                        value={formAge}
                                        onChange={(e) => setFormAge(e.target.value)}
                                        required
                                        min="0"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="e.g. 18"
                                        value={formWeight}
                                        onChange={(e) => setFormWeight(e.target.value)}
                                        min="0"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Gender
                                    </label>
                                    <select
                                        value={formGender}
                                        onChange={(e) => setFormGender(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="male">Male ♂</option>
                                        <option value="female">Female ♀</option>
                                        <option value="unknown">Unknown</option>
                                    </select>
                                </div>
                            </div>

                            {/* Medical Conditions & Health Needs */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Medical Conditions & Health Concerns
                                </label>
                                <p className="text-[11px] text-gray-500">
                                    Click common conditions or type your own to activate smart health recommendations.
                                </p>

                                {/* Common quick chips */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {commonConditions.map((cond) => {
                                        const isSelected = formMedicalConditions.includes(cond);
                                        return (
                                            <button
                                                key={cond}
                                                type="button"
                                                onClick={() => isSelected ? removeCondition(cond) : addCondition(cond)}
                                                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                                                    isSelected
                                                        ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'
                                                        : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                                                }`}
                                            >
                                                {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                                                {cond}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom input */}
                                <div className="flex gap-2 pt-2">
                                    <input
                                        type="text"
                                        placeholder="Add custom condition / allergy..."
                                        value={conditionInput}
                                        onChange={(e) => setConditionInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addCondition(conditionInput);
                                            }
                                        }}
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-900"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addCondition(conditionInput)}
                                        className="bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                                    >
                                        Add Tag
                                    </button>
                                </div>
                            </div>

                            {/* Dietary Preferences */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Dietary Preferences
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {commonDietaryPrefs.map((diet) => {
                                        const isSelected = formDietaryPreferences.includes(diet);
                                        return (
                                            <button
                                                key={diet}
                                                type="button"
                                                onClick={() => isSelected ? removeDiet(diet) : addDiet(diet)}
                                                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                                                    isSelected
                                                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                }`}
                                            >
                                                {diet}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Microchip */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Microchip / Registration ID (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 985141002341908"
                                    value={formMicrochipNumber}
                                    onChange={(e) => setFormMicrochipNumber(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 border-t border-gray-100 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsPetModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 text-sm hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formSubmitting || uploadingImage}
                                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
                                >
                                    {formSubmitting ? 'Saving Profile...' : editingPet ? 'Update Pet Profile' : 'Create Pet Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
