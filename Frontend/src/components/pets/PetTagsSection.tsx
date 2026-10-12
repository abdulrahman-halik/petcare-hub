'use client';

import React from 'react';

interface PetTagsSectionProps {
    commonConditions: string[];
    medicalConditions: string[];
    setMedicalConditions: React.Dispatch<React.SetStateAction<string[]>>;
    conditionInput: string;
    setConditionInput: (v: string) => void;
    allergies: string[];
    setAllergies: React.Dispatch<React.SetStateAction<string[]>>;
    allergyInput: string;
    setAllergyInput: (v: string) => void;
    microchipNumber: string;
    setMicrochipNumber: (v: string) => void;
    addTag: (list: string[], setList: any, item: string, clear: () => void) => void;
    removeTag: (list: string[], setList: any, item: string) => void;
}

export default function PetTagsSection({
    commonConditions,
    medicalConditions,
    setMedicalConditions,
    conditionInput,
    setConditionInput,
    allergies,
    setAllergies,
    allergyInput,
    setAllergyInput,
    microchipNumber,
    setMicrochipNumber,
    addTag,
    removeTag
}: PetTagsSectionProps) {
    return (
        <div className="space-y-4">
            {/* Medical Conditions */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Medical Conditions & Sensitivities</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {commonConditions.map(cond => (
                        <button
                            type="button"
                            key={cond}
                            onClick={() => addTag(medicalConditions, setMedicalConditions, cond, () => {})}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                                medicalConditions.includes(cond)
                                    ? 'bg-rose-600 text-white border-rose-600'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            {cond}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        value={conditionInput}
                        onChange={e => setConditionInput(e.target.value)}
                        placeholder="Add custom condition..."
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => addTag(medicalConditions, setMedicalConditions, conditionInput, () => setConditionInput(''))}
                        className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Allergies & Microchip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">Known Food Allergies</label>
                    <div className="flex gap-2">
                        <input
                            value={allergyInput}
                            onChange={e => setAllergyInput(e.target.value)}
                            placeholder="e.g. Chicken, Corn"
                            className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => addTag(allergies, setAllergies, allergyInput, () => setAllergyInput(''))}
                            className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {allergies.map(a => (
                            <span key={a} className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-200">
                                {a} <button type="button" onClick={() => removeTag(allergies, setAllergies, a)}>×</button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">Microchip ID (Optional)</label>
                    <input
                        value={microchipNumber}
                        onChange={e => setMicrochipNumber(e.target.value)}
                        placeholder="e.g. 985141002341908"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none font-mono"
                    />
                </div>
            </div>
        </div>
    );
}
