'use client';

import React from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Circle, CalendarCheck, Trash2 } from 'lucide-react';

interface AgendaListViewProps {
    loading: boolean;
    reminders: any[];
    onToggleStatus: (reminder: any) => void;
    onEdit: (reminder: any) => void;
    onDelete: (id: string) => void;
    getTypeColor: (type: string) => string;
}

export default function AgendaListView({
    loading,
    reminders,
    onToggleStatus,
    onEdit,
    onDelete,
    getTypeColor
}: AgendaListViewProps) {
    if (loading) {
        return (
            <div className="space-y-3 max-w-4xl mx-auto">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (reminders.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 max-w-4xl mx-auto">
                <CalendarCheck className="w-12 h-12 mx-auto text-gray-300" />
                <h4 className="font-bold text-gray-800">No scheduled reminders match filters</h4>
                <p className="text-xs text-gray-500">
                    Click Schedule Task or Generate Vet Health Plan to start tracking.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3 max-w-4xl mx-auto">
            {reminders.map((rem) => {
                const formattedDate = new Date(rem.dueDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });

                return (
                    <div
                        key={rem._id}
                        className={`p-4 sm:p-5 rounded-2xl border bg-white shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            rem.status === 'completed'
                                ? 'border-gray-200 bg-gray-50/40 opacity-75'
                                : rem.status === 'overdue'
                                ? 'border-rose-300 bg-rose-50/20'
                                : 'border-gray-100 hover:border-emerald-200'
                        }`}
                    >
                        <div className="flex items-start sm:items-center gap-3.5">
                            <button
                                onClick={() => onToggleStatus(rem)}
                                className="mt-0.5 sm:mt-0 text-gray-400 hover:text-emerald-600 transition-colors shrink-0"
                            >
                                {rem.status === 'completed' ? (
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                                ) : (
                                    <Circle className="w-6 h-6" />
                                )}
                            </button>

                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h4
                                        className={`font-bold text-sm sm:text-base ${
                                            rem.status === 'completed'
                                                ? 'text-gray-400 line-through'
                                                : 'text-gray-900'
                                        }`}
                                    >
                                        {rem.title}
                                    </h4>

                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getTypeColor(
                                            rem.type
                                        )}`}
                                    >
                                        {rem.type}
                                    </span>

                                    {rem.status === 'overdue' && (
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                                            Overdue
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                    <span className="font-semibold text-emerald-700">
                                        🐾 {rem.pet?.name || 'Pet'} ({rem.pet?.breed || rem.pet?.species})
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 font-medium">
                                        <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                                        {formattedDate} at {rem.time || '09:00 AM'}
                                    </span>
                                    {rem.frequency && rem.frequency !== 'once' && (
                                        <>
                                            <span>•</span>
                                            <span className="text-gray-400">
                                                Repeats {rem.frequency}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {rem.notes && (
                                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg max-w-xl">
                                        {rem.notes}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <button
                                onClick={() => onEdit(rem)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(rem._id)}
                                className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
