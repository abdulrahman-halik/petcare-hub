'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from '@/lib/axiosConfig';

interface ReminderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    editingReminder: any | null;
    pets: any[];
    defaultDate?: Date | null;
}

export default function ReminderFormModal({
    isOpen,
    onClose,
    onSaved,
    editingReminder,
    pets,
    defaultDate
}: ReminderFormModalProps) {
    const [petId, setPetId] = useState('');
    const [title, setTitle] = useState('');
    const [type, setType] = useState('vaccination');
    const [dueDate, setDueDate] = useState('');
    const [time, setTime] = useState('09:00 AM');
    const [frequency, setFrequency] = useState('once');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editingReminder) {
            setPetId(editingReminder.pet?._id || editingReminder.pet || pets[0]?._id || '');
            setTitle(editingReminder.title || '');
            setType(editingReminder.type || 'vaccination');
            setDueDate(editingReminder.dueDate ? new Date(editingReminder.dueDate).toISOString().split('T')[0] : '');
            setTime(editingReminder.time || '09:00 AM');
            setFrequency(editingReminder.frequency || 'once');
            setNotes(editingReminder.notes || '');
        } else {
            setPetId(pets[0]?._id || '');
            setTitle('');
            setType('vaccination');
            const d = defaultDate || new Date();
            setDueDate(d.toISOString().split('T')[0]);
            setTime('09:00 AM');
            setFrequency('once');
            setNotes('');
        }
        setError('');
    }, [editingReminder, defaultDate, pets, isOpen]);

    if (!isOpen) return null;

    const handleSaveReminder = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const payload = {
                petId,
                title: title.trim(),
                type,
                dueDate,
                time: time.trim(),
                frequency,
                notes: notes.trim()
            };

            if (editingReminder) {
                await axios.put(`/reminders/${editingReminder._id}`, payload);
            } else {
                await axios.post('/reminders', payload);
            }

            onSaved();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save reminder');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <h3 className="text-xl font-extrabold text-gray-900">
                        {editingReminder ? 'Edit Care Reminder' : 'Schedule Pet Care Task'}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSaveReminder} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Pet *
                        </label>
                        <select
                            value={petId}
                            onChange={(e) => setPetId(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                            {pets.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.name} ({p.species})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Rabies Booster Shot, Grooming Bath, Flea Pill"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                            { value: 'vaccination', label: '💉 Vaccine' },
                            { value: 'grooming', label: '🛁 Grooming' },
                            { value: 'medication', label: '💊 Medicine' },
                            { value: 'vet-visit', label: '🩺 Vet Visit' },
                            { value: 'diet', label: '🥣 Nutrition' },
                            { value: 'other', label: '📌 Other' }
                        ].map((t) => (
                            <button
                                key={t.value}
                                type="button"
                                onClick={() => setType(t.value)}
                                className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                                    type === t.value
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Due Date *
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Time
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 10:00 AM"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Recurrence
                        </label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="once">One-time event</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly (every 3 months)</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Notes & Instructions
                        </label>
                        <textarea
                            rows={2}
                            placeholder="e.g. Clinic address, medicine dosage, special care notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 text-sm hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
                        >
                            {submitting ? 'Saving...' : editingReminder ? 'Update Task' : 'Save Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
