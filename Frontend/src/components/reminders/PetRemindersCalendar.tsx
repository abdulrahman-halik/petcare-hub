'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    Clock,
    Plus,
    AlertTriangle,
    Sparkles,
    CalendarCheck
} from 'lucide-react';
import axios from '@/lib/axiosConfig';
import ReminderFormModal from './ReminderFormModal';
import CarePlanModal from './CarePlanModal';
import CalendarGridView from './CalendarGridView';
import AgendaListView from './AgendaListView';

interface PetRemindersCalendarProps {
    pets: any[];
    onRemindersChanged?: () => void;
}

export default function PetRemindersCalendar({ pets, onRemindersChanged }: PetRemindersCalendarProps) {
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

    const handleToggleStatus = async (reminder: any) => {
        try {
            const newStatus = reminder.status === 'completed' ? 'pending' : 'completed';
            await axios.patch(`/reminders/${reminder._id}/status`, { status: newStatus });
            fetchReminders();
            onRemindersChanged?.();
        } catch (err) {
            console.error('Failed to toggle reminder status:', err);
        }
    };

    const handleDeleteReminder = async (id: string) => {
        if (!confirm('Are you sure you want to remove this reminder?')) return;
        try {
            await axios.delete(`/reminders/${id}`);
            fetchReminders();
            onRemindersChanged?.();
        } catch (err) {
            console.error('Failed to delete reminder:', err);
        }
    };

    const handleOpenAddModal = (dateToPrefill?: Date) => {
        setEditingReminder(null);
        if (dateToPrefill) setSelectedDate(dateToPrefill);
        setIsAddModalOpen(true);
    };

    const handleOpenEditModal = (reminder: any) => {
        setEditingReminder(reminder);
        setIsAddModalOpen(true);
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'vaccination': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'grooming': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'medication': return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'vet-visit': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default: return 'bg-amber-50 text-amber-700 border-amber-200';
        }
    };

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const remindersByDate: { [key: string]: any[] } = {};
    reminders.forEach((r) => {
        const d = new Date(r.dueDate).toISOString().split('T')[0];
        if (!remindersByDate[d]) remindersByDate[d] = [];
        remindersByDate[d].push(r);
    });

    const overdueCount = reminders.filter(r => r.status === 'overdue').length;
    const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
    const selectedDateReminders = remindersByDate[selectedDateStr] || [];

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Top Header & View Controls */}
            <div className="p-6 sm:p-8 bg-emerald-50 border-b border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-full text-xs font-semibold text-[#047857] mb-2 border border-emerald-200">
                        <CalendarCheck className="w-3.5 h-3.5 text-[#047857]" />
                        <span>Automated Health & Care Scheduling</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                        Pet Care Calendar & Reminders
                    </h2>
                    <p className="text-sm text-slate-600 mt-1 max-w-xl">
                        Keep your pets happy & healthy with automated vaccine tracking, grooming cycles, and vet appointment logs.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setIsPlanModalOpen(true)}
                        disabled={pets.length === 0}
                        className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                        <Sparkles className="w-4 h-4 text-[#047857]" />
                        <span>⚡ Generate Vet Health Plan</span>
                    </button>

                    <button
                        onClick={() => handleOpenAddModal()}
                        disabled={pets.length === 0}
                        className="bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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
                <div className="flex items-center bg-gray-200/80 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            viewMode === 'calendar' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>Calendar View</span>
                    </button>
                    <button
                        onClick={() => setViewMode('agenda')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            viewMode === 'agenda' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Agenda / Tasks ({reminders.length})</span>
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <select
                        value={selectedPetFilter}
                        onChange={(e) => setSelectedPetFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">🐾 All Pets</option>
                        {pets.map((p) => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedTypeFilter}
                        onChange={(e) => setSelectedTypeFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">All Care Types</option>
                        <option value="vaccination">💉 Vaccination</option>
                        <option value="grooming">🛁 Grooming</option>
                        <option value="medication">💊 Medication</option>
                        <option value="vet-visit">🩺 Vet Visit</option>
                        <option value="diet">🥣 Diet & Food</option>
                        <option value="other">📌 Other</option>
                    </select>

                    <select
                        value={selectedStatusFilter}
                        onChange={(e) => setSelectedStatusFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">⏳ Pending</option>
                        <option value="completed">✅ Completed</option>
                        <option value="overdue">⚠️ Overdue</option>
                    </select>
                </div>
            </div>

            {/* Main View Area */}
            {viewMode === 'calendar' ? (
                <CalendarGridView
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    onPrevMonth={prevMonth}
                    onNextMonth={nextMonth}
                    remindersByDate={remindersByDate}
                    selectedDateReminders={selectedDateReminders}
                    onOpenAddModal={handleOpenAddModal}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteReminder}
                    getTypeColor={getTypeColor}
                />
            ) : (
                <div className="p-4 sm:p-6">
                    <AgendaListView
                        loading={loading}
                        reminders={reminders}
                        onToggleStatus={handleToggleStatus}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDeleteReminder}
                        getTypeColor={getTypeColor}
                    />
                </div>
            )}

            {/* MODALS */}
            <ReminderFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSaved={() => { fetchReminders(); onRemindersChanged?.(); }}
                editingReminder={editingReminder}
                pets={pets}
                defaultDate={selectedDate}
            />

            <CarePlanModal
                isOpen={isPlanModalOpen}
                onClose={() => setIsPlanModalOpen(false)}
                onGenerated={() => { fetchReminders(); onRemindersChanged?.(); }}
                pets={pets}
            />
        </div>
    );
}
