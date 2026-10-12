'use client';

import React from 'react';
import { Edit3, Trash2, Shield, Tag } from 'lucide-react';

interface PetCardProps {
    pet: any;
    onEdit: (pet: any) => void;
    onDelete: (id: string, name: string) => void;
}

export const getSpeciesEmoji = (species: string) => {
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

export default function PetCard({ pet, onEdit, onDelete }: PetCardProps) {
    return (
        <div className="bg-white rounded-3xl border border-gray-100/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
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
                                {pet.breed || pet.species} • {getSpeciesEmoji(pet.species)} {pet.species?.toUpperCase()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onEdit(pet)}
                            className="p-2 rounded-xl text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Edit Pet"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(pet._id, pet.name)}
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
                            Health & Conditions
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                            {pet.medicalConditions.map((cond: string, i: number) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60 px-2 py-0.5 rounded-lg"
                                >
                                    <Shield className="w-3 h-3 text-rose-500" />
                                    <span>{cond}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Allergies / Diets */}
                {pet.allergies && pet.allergies.length > 0 && (
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                            Allergies
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                            {pet.allergies.map((all: string, i: number) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 px-2 py-0.5 rounded-lg"
                                >
                                    <Tag className="w-3 h-3 text-amber-500" />
                                    <span>{all}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Microchip Footer */}
            {pet.microchipNumber && (
                <div className="px-6 py-3 bg-gray-50/70 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
                    <span>Microchip</span>
                    <span className="font-mono font-bold text-gray-600">{pet.microchipNumber}</span>
                </div>
            )}
        </div>
    );
}
