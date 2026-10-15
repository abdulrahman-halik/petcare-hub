'use client';

import React, { useState } from 'react';
import { Sparkles, X, Check } from 'lucide-react';
import axios from '@/lib/axiosConfig';

interface CarePlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerated: () => void;
    pets: any[];
}

export default function CarePlanModal({
    isOpen,
    onClose,
    onGenerated,
    pets
}: CarePlanModalProps) {
    const [planPetId, setPlanPetId] = useState(pets[0]?._id || '');
    const [planSuccess, setPlanSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleGenerateCarePlan = async () => {
        const targetId = planPetId || pets[0]?._id;
        if (!targetId) return;

        try {
            setSubmitting(true);
            const { data } = await axios.post(`/reminders/generate-plan/${targetId}`);
            setPlanSuccess(data.message || 'Health plan scheduled successfully!');
            onGenerated();
            setTimeout(() => {
                setPlanSuccess('');
                onClose();
            }, 1800);
        } catch (err: any) {
            console.error('Failed to generate health plan:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 relative space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#047857] flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-[#047857]" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900">
                            Automated Vet Health Plan
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {planSuccess ? (
                    <div className="p-4 bg-emerald-50 text-emerald-800 text-sm font-bold rounded-2xl border border-emerald-200 flex items-center gap-2">
                        <Check className="w-5 h-5 text-emerald-600" />
                        <span>{planSuccess}</span>
                    </div>
                ) : (
                    <>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Our intelligent scheduling engine will automatically build a full year of core vaccination boosters, monthly parasite preventatives, routine grooming cycles, and annual wellness exams tailored to your pet's species and age.
                        </p>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Select Target Pet
                            </label>
                            <select
                                value={planPetId}
                                onChange={(e) => setPlanPetId(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-semibold text-gray-900"
                            >
                                {pets.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.name} ({p.breed || p.species}, Age {p.age || 1})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-semibold text-slate-700 text-xs transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateCarePlan}
                                disabled={submitting}
                                className="flex-1 py-3 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                            >
                                {submitting ? 'Generating...' : '⚡ Generate Schedule'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
