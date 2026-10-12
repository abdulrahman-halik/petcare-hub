'use client';

import React from 'react';

interface PetBasicFieldsProps {
    name: string;
    setName: (v: string) => void;
    species: string;
    setSpecies: (v: string) => void;
    breed: string;
    setBreed: (v: string) => void;
    age: string;
    setAge: (v: string) => void;
    weight: string;
    setWeight: (v: string) => void;
    gender: string;
    setGender: (v: string) => void;
    activityLevel: string;
    setActivityLevel: (v: string) => void;
}

export default function PetBasicFields({
    name,
    setName,
    species,
    setSpecies,
    breed,
    setBreed,
    age,
    setAge,
    weight,
    setWeight,
    gender,
    setGender,
    activityLevel,
    setActivityLevel
}: PetBasicFieldsProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Pet Name *</label>
                    <input
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Luna, Milo"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Species *</label>
                    <select
                        value={species}
                        onChange={e => setSpecies(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                        <option value="dog">🐕 Dog</option>
                        <option value="cat">🐈 Cat</option>
                        <option value="bird">🦜 Bird</option>
                        <option value="fish">🐠 Fish</option>
                        <option value="small-pet">🐹 Small Pet</option>
                        <option value="other">🐾 Other</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700 block mb-1">Breed / Mix</label>
                    <input
                        value={breed}
                        onChange={e => setBreed(e.target.value)}
                        placeholder="e.g. Golden Retriever"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Age (Years) *</label>
                    <input
                        type="number"
                        required
                        min="0"
                        max="40"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Weight (kg) *</label>
                    <input
                        type="number"
                        step="0.1"
                        required
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Gender</label>
                    <select
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                        <option value="male">♂ Male</option>
                        <option value="female">♀ Female</option>
                        <option value="unknown">Unknown</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Activity Level</label>
                    <select
                        value={activityLevel}
                        onChange={e => setActivityLevel(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                        <option value="low">Low (Senior / Indoor)</option>
                        <option value="moderate">Moderate (Standard)</option>
                        <option value="high">High (Active / Working)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
