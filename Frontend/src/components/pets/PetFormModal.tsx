'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Check, AlertCircle } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import PetBasicFields from './PetBasicFields';
import PetTagsSection from './PetTagsSection';

interface PetFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    editingPet: any | null;
}

const COMMON_CONDITIONS = [
    'Joint Stiffness / Arthritis',
    'Sensitive Digestion / Stomach',
    'Skin & Coat Dryness',
    'Dental Plaque / Bad Breath',
    'Anxiety / Stress',
    'Weight Management',
    'Puppy Teething / Growth',
    'Hairballs'
];

export default function PetFormModal({
    isOpen,
    onClose,
    onSaved,
    editingPet
}: PetFormModalProps) {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('dog');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('1');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('male');
    const [weight, setWeight] = useState('5');
    const [activityLevel, setActivityLevel] = useState('moderate');
    const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
    const [conditionInput, setConditionInput] = useState('');
    const [allergies, setAllergies] = useState<string[]>([]);
    const [allergyInput, setAllergyInput] = useState('');
    const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
    const [microchipNumber, setMicrochipNumber] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editingPet) {
            setName(editingPet.name || '');
            setSpecies(editingPet.species || 'dog');
            setBreed(editingPet.breed || '');
            setAge(String(editingPet.age || '1'));
            setBirthDate(editingPet.birthDate ? new Date(editingPet.birthDate).toISOString().split('T')[0] : '');
            setGender(editingPet.gender || 'male');
            setWeight(String(editingPet.weight || '5'));
            setActivityLevel(editingPet.activityLevel || 'moderate');
            setMedicalConditions(editingPet.medicalConditions || []);
            setAllergies(editingPet.allergies || []);
            setDietaryPreferences(editingPet.dietaryPreferences || []);
            setMicrochipNumber(editingPet.microchipNumber || '');
            setImageUrl(editingPet.imageUrl || '');
        } else {
            setName('');
            setSpecies('dog');
            setBreed('');
            setAge('1');
            setBirthDate('');
            setGender('male');
            setWeight('5');
            setActivityLevel('moderate');
            setMedicalConditions([]);
            setAllergies([]);
            setDietaryPreferences([]);
            setMicrochipNumber('');
            setImageUrl('');
        }
        setError('');
    }, [editingPet, isOpen]);

    if (!isOpen) return null;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', 'pets');

        try {
            setUploadingImage(true);
            const { data } = await axios.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImageUrl(data.data.url);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Image upload failed');
        } finally {
            setUploadingImage(false);
        }
    };

    const addTag = (list: string[], setList: any, item: string, clearInput: () => void) => {
        const trimmed = item.trim();
        if (trimmed && !list.includes(trimmed)) {
            setList([...list, trimmed]);
            clearInput();
        }
    };

    const removeTag = (list: string[], setList: any, item: string) => {
        setList(list.filter(i => i !== item));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setError('');

            const payload: any = {
                name,
                species,
                breed,
                age: Number(age),
                gender,
                weight: Number(weight),
                activityLevel,
                medicalConditions,
                allergies,
                dietaryPreferences,
                microchipNumber,
                imageUrl
            };
            if (birthDate) payload.birthDate = birthDate;

            if (editingPet) {
                await axios.put(`/pets/${editingPet._id}`, payload);
            } else {
                await axios.post('/pets', payload);
            }

            onSaved();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save pet profile');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">
                            {editingPet ? `Edit ${editingPet.name}'s Profile` : 'Register a New Pet'}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Tailor care plans, reminders, and smart product recommendations.
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3.5 rounded-2xl">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Avatar */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-2xl bg-emerald-50 border-2 border-dashed border-emerald-300 flex items-center justify-center overflow-hidden shrink-0">
                            {imageUrl ? (
                                <img src={imageUrl} alt="Pet Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl">🐾</span>
                            )}
                            {uploadingImage && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">
                                    Uploading...
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors">
                                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Upload Photo</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                            <p className="text-[11px] text-gray-400 mt-1">Recommended square JPG/PNG under 5MB</p>
                        </div>
                    </div>

                    <PetBasicFields
                        name={name}
                        setName={setName}
                        species={species}
                        setSpecies={setSpecies}
                        breed={breed}
                        setBreed={setBreed}
                        age={age}
                        setAge={setAge}
                        weight={weight}
                        setWeight={setWeight}
                        gender={gender}
                        setGender={setGender}
                        activityLevel={activityLevel}
                        setActivityLevel={setActivityLevel}
                    />

                    <PetTagsSection
                        commonConditions={COMMON_CONDITIONS}
                        medicalConditions={medicalConditions}
                        setMedicalConditions={setMedicalConditions}
                        conditionInput={conditionInput}
                        setConditionInput={setConditionInput}
                        allergies={allergies}
                        setAllergies={setAllergies}
                        allergyInput={allergyInput}
                        setAllergyInput={setAllergyInput}
                        microchipNumber={microchipNumber}
                        setMicrochipNumber={setMicrochipNumber}
                        addTag={addTag}
                        removeTag={removeTag}
                    />

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                        >
                            <Check className="w-4 h-4" />
                            <span>{submitting ? 'Saving...' : editingPet ? 'Update Pet Profile' : 'Save Pet Profile'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
