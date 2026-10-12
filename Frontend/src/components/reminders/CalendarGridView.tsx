'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Plus, CalendarCheck, CheckCircle2, Circle, Edit3, Trash2 } from 'lucide-react';

interface CalendarGridViewProps {
    currentDate: Date;
    selectedDate: Date | null;
    onSelectDate: (d: Date) => void;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    remindersByDate: { [key: string]: any[] };
    selectedDateReminders: any[];
    onOpenAddModal: (d?: Date) => void;
    onToggleStatus: (reminder: any) => void;
    onEdit: (reminder: any) => void;
    onDelete: (id: string) => void;
    getTypeColor: (type: string) => string;
}

export default function CalendarGridView({
    currentDate,
    selectedDate,
    onSelectDate,
    onPrevMonth,
    onNextMonth,
    remindersByDate,
    selectedDateReminders,
    onOpenAddModal,
    onToggleStatus,
    onEdit,
    onDelete,
    getTypeColor
}: CalendarGridViewProps) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const todayStr = new Date().toISOString().split('T')[0];
    const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
            {/* MONTH MATRIX */}
            <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between pb-2">
                    <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl">
                        {monthNames[month]} {year}
                    </h3>
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                        <button onClick={onPrevMonth} className="p-1.5 rounded-lg hover:bg-white text-gray-600 hover:text-gray-900 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={onNextMonth} className="p-1.5 rounded-lg hover:bg-white text-gray-600 hover:text-gray-900 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-400 py-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d}>{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {/* Previous Month Padding */}
                    {Array.from({ length: firstDayIndex }).map((_, idx) => (
                        <div key={`prev-${idx}`} className="h-16 sm:h-20 p-1 rounded-xl bg-gray-50/50 opacity-40 text-xs text-gray-400">
                            {prevMonthDays - firstDayIndex + idx + 1}
                        </div>
                    ))}

                    {/* Current Month Days */}
                    {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
                        const dayNumber = idx + 1;
                        const thisDate = new Date(year, month, dayNumber);
                        const thisDateStr = thisDate.toISOString().split('T')[0];
                        const dayReminders = remindersByDate[thisDateStr] || [];
                        const isToday = thisDateStr === todayStr;
                        const isSelected = thisDateStr === selectedDateStr;

                        return (
                            <div
                                key={`day-${dayNumber}`}
                                onClick={() => onSelectDate(thisDate)}
                                className={`h-16 sm:h-20 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                    isSelected
                                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/30'
                                        : isToday
                                        ? 'border-emerald-300 bg-white font-bold'
                                        : 'border-gray-100 hover:border-gray-300 bg-white'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs ${isToday ? 'w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold' : 'text-gray-700'}`}>
                                        {dayNumber}
                                    </span>
                                    {dayReminders.length > 0 && (
                                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                                            {dayReminders.length}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-0.5 overflow-hidden">
                                    {dayReminders.slice(0, 2).map((r, i) => (
                                        <div key={r._id || i} className="text-[9px] truncate px-1 py-0.2 rounded bg-gray-100 text-gray-700 font-medium">
                                            {r.title}
                                        </div>
                                    ))}
                                    {dayReminders.length > 2 && (
                                        <div className="text-[8px] text-gray-400 font-semibold pl-1">
                                            +{dayReminders.length - 2} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SELECTED DAY AGENDA SIDEBAR */}
            <div className="lg:col-span-4 bg-gray-50/70 rounded-2xl p-6 border border-gray-100 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Selected Date Schedule</p>
                        <h4 className="font-black text-gray-900 text-base">
                            {selectedDate?.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </h4>
                    </div>
                    <button
                        onClick={() => onOpenAddModal(selectedDate || new Date())}
                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                        title="Add task for this date"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {selectedDateReminders.length === 0 ? (
                    <div className="text-center py-8 space-y-2 text-gray-400">
                        <CalendarCheck className="w-8 h-8 mx-auto text-gray-300" />
                        <p className="text-xs font-semibold">No care events on this day</p>
                        <button
                            onClick={() => onOpenAddModal(selectedDate || new Date())}
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-bold inline-block pt-1"
                        >
                            + Schedule a Reminder
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {selectedDateReminders.map((rem) => (
                            <div
                                key={rem._id}
                                className={`p-3.5 rounded-xl border bg-white shadow-xs transition-all space-y-2 ${
                                    rem.status === 'completed'
                                        ? 'border-gray-200 opacity-75'
                                        : rem.status === 'overdue'
                                        ? 'border-rose-200 ring-1 ring-rose-200'
                                        : 'border-gray-100 hover:border-emerald-200'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2.5">
                                        <button
                                            onClick={() => onToggleStatus(rem)}
                                            className="mt-0.5 text-gray-400 hover:text-emerald-600 transition-colors shrink-0"
                                        >
                                            {rem.status === 'completed' ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                                            ) : (
                                                <Circle className="w-5 h-5" />
                                            )}
                                        </button>
                                        <div>
                                            <h5
                                                className={`text-xs font-bold leading-tight ${
                                                    rem.status === 'completed'
                                                        ? 'text-gray-400 line-through'
                                                        : 'text-gray-900'
                                                }`}
                                            >
                                                {rem.title}
                                            </h5>
                                            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                                                <span className="font-semibold text-emerald-700">
                                                    🐾 {rem.pet?.name || 'Pet'}
                                                </span>
                                                <span>•</span>
                                                <span>{rem.time || 'All Day'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <button onClick={() => onEdit(rem)} className="p-1 rounded text-gray-400 hover:text-gray-700">
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => onDelete(rem._id)} className="p-1 rounded text-gray-400 hover:text-rose-600">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {rem.notes && (
                                    <p className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg leading-relaxed">
                                        {rem.notes}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-[10px] pt-1">
                                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${getTypeColor(rem.type)}`}>
                                        {rem.type}
                                    </span>
                                    {rem.frequency && rem.frequency !== 'once' && (
                                        <span className="text-gray-400">
                                            Repeats {rem.frequency}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
