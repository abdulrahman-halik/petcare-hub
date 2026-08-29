'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    Clock,
    Plus,
    CheckCircle2,
    Circle,
    AlertTriangle,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Edit3,
    Syringe,
    Bath,
    Pill,
    Stethoscope,
    HeartPulse,
    Filter,
    X,
    Check,
    CalendarCheck,
    RotateCcw
} from 'lucide-react';
import axios from '@/lib/axiosConfig';

interface PetRemindersCalendarProps {
    pets: any[];
    onRefreshPets?: () => void;
}

export default function PetRemindersCalendar({ pets, onRefreshPets }: PetRemindersCalendarProps) {
    const [reminders, setReminders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'calendar' | 'agenda'>('calendar');

    // Filter states
    const [selectedPetFilter, setSelectedPetFilter] = useState('all');
    const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

    // Calendar navigation state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [editingReminder, setEditingReminder] = useState<any | null>(null);

    // Form inputs for Add/Edit Reminder
    const [formPetId, setFormPetId] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [formType, setFormType] = useState('vaccination');
    const [formDueDate, setFormDueDate] = useState('');
    const [formTime, setFormTime] = useState('09:00 AM');
    const [formFrequency, setFormFrequency] = useState('once');
    const [formNotes, setFormNotes] = useState('');
    const [formError, setFormError] = useState('');
    const [formSubmitting, setFormSubmitting] = useState(false);

    // Automated Care Plan generator state
    const [planPetId, setPlanPetId] = useState('');
    const [planSuccess, setPlanSuccess] = useState('');

    // Fetch Reminders
    const fetchReminders = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (selectedPetFilter !== 'all') params.pet = selectedPetFilter;
            if (selectedTypeFilter !== 'all') params.type = selectedTypeFilter;
            if (selectedStatusFilter !== 'all') params.status = selectedStatusFilter;

            const { data } = await axios.get('/reminders', { params });
            setReminders(data.data.reminders || []);
        } catch (err) {
            console.error('Failed to load reminders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, [selectedPetFilter, selectedTypeFilter, selectedStatusFilter]);

    // Handle Quick Status Toggle
    const handleToggleStatus = async (reminder: any) => {
        try {
            const newStatus = reminder.status === 'completed' ? 'pending' : 'completed';
            await axios.patch(`/reminders/${reminder._id}/status`, { status: newStatus });
            fetchReminders();
        } catch (err) {
            console.error('Failed to toggle reminder status:', err);
        }
    };

    // Handle Delete Reminder
    const handleDeleteReminder = async (id: string) => {
        if (!confirm('Are you sure you want to remove this reminder?')) return;
        try {
            await axios.delete(`/reminders/${id}`);
            fetchReminders();
        } catch (err) {
            console.error('Failed to delete reminder:', err);
        }
    };

    // Open Add Modal
    const handleOpenAddModal = (dateToPrefill?: Date) => {
        setEditingReminder(null);
        setFormPetId(pets[0]?._id || '');
        setFormTitle('');
        setFormType('vaccination');
        const defaultDate = dateToPrefill || new Date();
        setFormDueDate(defaultDate.toISOString().split('T')[0]);
        setFormTime('09:00 AM');
        setFormFrequency('once');
        setFormNotes('');
        setFormError('');
        setIsAddModalOpen(true);
    };

    // Open Edit Modal
    const handleOpenEditModal = (reminder: any) => {
        setEditingReminder(reminder);
        setFormPetId(reminder.pet?._id || reminder.pet || '');
        setFormTitle(reminder.title);
        setFormType(reminder.type || 'other');
        setFormDueDate(new Date(reminder.dueDate).toISOString().split('T')[0]);
        setFormTime(reminder.time || '09:00 AM');
        setFormFrequency(reminder.frequency || 'once');
        setFormNotes(reminder.notes || '');
        setFormError('');
        setIsAddModalOpen(true);
    };

    // Submit Add/Edit Form
    const handleSaveReminder = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setFormSubmitting(true);

        try {
            const payload = {
                petId: formPetId,
                title: formTitle,
                type: formType,
                dueDate: formDueDate,
                time: formTime,
                frequency: formFrequency,
                notes: formNotes
            };

            if (editingReminder) {
                await axios.put(`/reminders/${editingReminder._id}`, payload);
            } else {
                await axios.post('/reminders', payload);
            }

            setIsAddModalOpen(false);
            fetchReminders();
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Failed to save reminder');
        } finally {
            setFormSubmitting(false);
        }
    };

    // 1-Click Generate Plan
    const handleGenerateCarePlan = async () => {
        if (!planPetId) return;
        try {
            setFormSubmitting(true);
            const { data } = await axios.post(`/reminders/generate-plan/${planPetId}`);
            setPlanSuccess(data.message);
            fetchReminders();
            setTimeout(() => {
                setIsPlanModalOpen(false);
                setPlanSuccess('');
            }, 1500);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to generate care plan');
        } finally {
            setFormSubmitting(false);
        }
    };

    // Type Badge Helper
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'vaccination':
                return <Syringe className="w-3.5 h-3.5 text-purple-600" />;
            case 'grooming':
                return <Bath className="w-3.5 h-3.5 text-blue-600" />;
            case 'medication':
                return <Pill className="w-3.5 h-3.5 text-rose-600" />;
            case 'vet-visit':
                return <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />;
            default:
                return <HeartPulse className="w-3.5 h-3.5 text-amber-600" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'vaccination':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'grooming':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'medication':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'vet-visit':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default:
                return 'bg-amber-50 text-amber-700 border-amber-200';
        }
    };

    // Calendar Calculations
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    // Group reminders by date string YYYY-MM-DD
    const remindersByDate: { [key: string]: any[] } = {};
    reminders.forEach((r) => {
        const d = new Date(r.dueDate).toISOString().split('T')[0];
        if (!remindersByDate[d]) remindersByDate[d] = [];
        remindersByDate[d].push(r);
    });

    const overdueCount = reminders.filter(r => r.status === 'overdue').length;

    // Selected date reminders
    const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
    const selectedDateReminders = remindersByDate[selectedDateStr] || [];

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Top Header & View Controls */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-2 border border-white/10">
                        <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Automated Health & Care Scheduling</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Pet Care Calendar & Reminders
                    </h2>
                    <p className="text-sm text-emerald-100/80 mt-1 max-w-xl">
                        Keep your pets happy & healthy with automated vaccine tracking, grooming cycles, and vet appointment logs.
                    </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => {
                            setPlanPetId(pets[0]?._id || '');
                            setIsPlanModalOpen(true);
                        }}
                        disabled={pets.length === 0}
                        className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                        <Sparkles className="w-4 h-4 text-gray-900" />
                        <span>⚡ Generate Vet Health Plan</span>
                    </button>

                    <button
                        onClick={() => handleOpenAddModal()}
                        disabled={pets.length === 0}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Schedule Task</span>
                    </button>
                </div>
            </div>

            {/* Overdue Warning Alert Banner */}
            {overdueCount > 0 && (
                <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-amber-800 text-xs sm:text-sm font-semibold">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                            You have <strong className="font-black text-amber-900">{overdueCount}</strong> overdue care reminder(s) requiring attention.
                        </span>
                    </div>
                    <button
                        onClick={() => setSelectedStatusFilter('overdue')}
                        className="text-xs font-bold text-amber-900 underline hover:text-amber-700 shrink-0"
                    >
                        View Overdue Tasks
                    </button>
                </div>
            )}

            {/* Filter and View Mode Toolbar */}
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-200/80 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            viewMode === 'calendar'
                                ? 'bg-white text-emerald-800 shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>Calendar View</span>
                    </button>
                    <button
                        onClick={() => setViewMode('agenda')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            viewMode === 'agenda'
                                ? 'bg-white text-emerald-800 shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Agenda / Tasks ({reminders.length})</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {/* Pet Filter */}
                    <select
                        value={selectedPetFilter}
                        onChange={(e) => setSelectedPetFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">🐾 All Pets</option>
                        {pets.map((p) => (
                            <option key={p._id} value={p._id}>
                                {p.name} ({p.species})
                            </option>
                        ))}
                    </select>

                    {/* Type Filter */}
                    <select
                        value={selectedTypeFilter}
                        onChange={(e) => setSelectedTypeFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">🏷️ All Event Types</option>
                        <option value="vaccination">💉 Vaccinations</option>
                        <option value="grooming">🛁 Grooming</option>
                        <option value="medication">💊 Medications</option>
                        <option value="vet-visit">🩺 Vet Visits</option>
                        <option value="other">📌 Other</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatusFilter}
                        onChange={(e) => setSelectedStatusFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">📋 All Statuses</option>
                        <option value="pending">⏳ Pending</option>
                        <option value="completed">✅ Completed</option>
                        <option value="overdue">⚠️ Overdue</option>
                    </select>
                </div>
            </div>

            {/* MAIN CONTENT: CALENDAR OR AGENDA */}
            <div className="p-4 sm:p-6 lg:p-8">
                {viewMode === 'calendar' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* CALENDAR MONTH GRID */}
                        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-xs space-y-4">
                            {/* Month Header Navigation */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
                                    <span>{monthNames[month]} {year}</span>
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={prevMonth}
                                        className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentDate(new Date())}
                                        className="px-3 py-1 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                                    >
                                        Today
                                    </button>
                                    <button
                                        onClick={nextMonth}
                                        className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Days of week */}
                            <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 py-1 uppercase tracking-wider">
                                <span>Sun</span>
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                            </div>

                            {/* Month Days Grid */}
                            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                                {/* Previous month pad days */}
                                {Array.from({ length: firstDayIndex }).map((_, i) => (
                                    <div
                                        key={`prev-${i}`}
                                        className="min-h-[70px] sm:min-h-[85px] p-1.5 rounded-xl bg-gray-50/40 text-gray-300 text-xs text-right opacity-50"
                                    >
                                        {prevMonthDays - firstDayIndex + i + 1}
                                    </div>
                                ))}

                                {/* Current month days */}
                                {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                                    const dayNum = i + 1;
                                    const thisDate = new Date(year, month, dayNum);
                                    const thisDateStr = thisDate.toISOString().split('T')[0];
                                    const dayReminders = remindersByDate[thisDateStr] || [];
                                    const isToday = new Date().toDateString() === thisDate.toDateString();
                                    const isSelected = selectedDate?.toDateString() === thisDate.toDateString();

                                    return (
                                        <div
                                            key={dayNum}
                                            onClick={() => setSelectedDate(thisDate)}
                                            className={`min-h-[70px] sm:min-h-[85px] p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                                isSelected
                                                    ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                                                    : isToday
                                                    ? 'border-emerald-300 bg-emerald-50/20'
                                                    : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50/60'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                                                        isToday
                                                            ? 'bg-emerald-600 text-white'
                                                            : isSelected
                                                            ? 'text-emerald-700 font-black'
                                                            : 'text-gray-700'
                                                    }`}
                                                >
                                                    {dayNum}
                                                </span>
                                                {dayReminders.length > 0 && (
                                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1 rounded-md">
                                                        {dayReminders.length}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Micro event pills on calendar */}
                                            <div className="space-y-1 mt-1 overflow-hidden">
                                                {dayReminders.slice(0, 2).map((rem) => (
                                                    <div
                                                        key={rem._id}
                                                        className={`text-[9px] sm:text-[10px] font-bold px-1 py-0.5 rounded truncate border ${
                                                            rem.status === 'completed'
                                                                ? 'bg-gray-100 text-gray-500 line-through border-gray-200'
                                                                : rem.status === 'overdue'
                                                                ? 'bg-rose-50 text-rose-700 border-rose-200 font-black'
                                                                : getTypeColor(rem.type)
                                                        }`}
                                                    >
                                                        {rem.pet?.name ? `${rem.pet.name}: ` : ''}{rem.title}
                                                    </div>
                                                ))}
                                                {dayReminders.length > 2 && (
                                                    <div className="text-[9px] text-gray-400 font-bold text-center">
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
                                    onClick={() => handleOpenAddModal(selectedDate || new Date())}
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
                                        onClick={() => handleOpenAddModal(selectedDate || new Date())}
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
                                                        onClick={() => handleToggleStatus(rem)}
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
                                                    <button
                                                        onClick={() => handleOpenEditModal(rem)}
                                                        className="p-1 rounded text-gray-400 hover:text-gray-700"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteReminder(rem._id)}
                                                        className="p-1 rounded text-gray-400 hover:text-rose-600"
                                                    >
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
                                                <span
                                                    className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${getTypeColor(
                                                        rem.type
                                                    )}`}
                                                >
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
                ) : (
                    /* AGENDA / LIST VIEW */
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : reminders.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                <CalendarCheck className="w-12 h-12 mx-auto text-gray-300" />
                                <h4 className="font-bold text-gray-800">No scheduled reminders match filters</h4>
                                <p className="text-xs text-gray-500">
                                    Click Schedule Task or Generate Vet Health Plan to start tracking.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
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
                                                    onClick={() => handleToggleStatus(rem)}
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
                                                    onClick={() => handleOpenEditModal(rem)}
                                                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReminder(rem._id)}
                                                    className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* SCHEDULE / EDIT REMINDER MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <h3 className="text-xl font-extrabold text-gray-900">
                                {editingReminder ? 'Edit Care Reminder' : 'Schedule Pet Care Task'}
                            </h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
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

                        <form onSubmit={handleSaveReminder} className="space-y-4 mt-4">
                            {/* Pet Selector */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Pet *
                                </label>
                                <select
                                    value={formPetId}
                                    onChange={(e) => setFormPetId(e.target.value)}
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

                            {/* Task Title */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Task Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Rabies Booster Shot, Grooming Bath, Flea Pill"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>

                            {/* Event Type */}
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
                                        onClick={() => setFormType(t.value)}
                                        className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                                            formType === t.value
                                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            {/* Due Date and Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Due Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={formDueDate}
                                        onChange={(e) => setFormDueDate(e.target.value)}
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
                                        value={formTime}
                                        onChange={(e) => setFormTime(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Recurrence Frequency */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Recurrence
                                </label>
                                <select
                                    value={formFrequency}
                                    onChange={(e) => setFormFrequency(e.target.value)}
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

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Notes & Instructions
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="e.g. Clinic address, medicine dosage, special care notes..."
                                    value={formNotes}
                                    onChange={(e) => setFormNotes(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 text-sm hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formSubmitting}
                                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
                                >
                                    {formSubmitting ? 'Saving...' : editingReminder ? 'Update Task' : 'Save Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 1-CLICK VET HEALTH PLAN MODAL */}
            {isPlanModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 relative space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-amber-600" />
                                </div>
                                <h3 className="text-lg font-extrabold text-gray-900">
                                    Automated Vet Health Plan
                                </h3>
                            </div>
                            <button onClick={() => setIsPlanModalOpen(false)} className="p-1 rounded-lg text-gray-400">
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
                                        onClick={() => setIsPlanModalOpen(false)}
                                        className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleGenerateCarePlan}
                                        disabled={formSubmitting}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-black text-xs shadow-md"
                                    >
                                        {formSubmitting ? 'Generating...' : '⚡ Generate Schedule'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
