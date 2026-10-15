'use client';

import React from 'react';
import { CheckCircle2, ChevronRight, Plus, RefreshCw } from 'lucide-react';

export interface TicketMessage {
    sender: 'customer' | 'support' | 'system';
    senderName: string;
    message: string;
    createdAt: string;
}

export interface SupportTicket {
    _id: string;
    ticketNumber: string;
    subject: string;
    category: string;
    priority: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    orderNumber?: string;
    petName?: string;
    messages: TicketMessage[];
    createdAt: string;
    updatedAt: string;
}

interface SupportTicketListProps {
    tickets: SupportTicket[];
    loading: boolean;
    onSelectTicket: (ticket: SupportTicket) => void;
    onOpenCreateModal: () => void;
}

export function getStatusBadge(status: string) {
    switch (status) {
        case 'open':
            return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Open</span>;
        case 'in_progress':
            return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">In Progress</span>;
        case 'resolved':
            return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Resolved</span>;
        case 'closed':
            return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Closed</span>;
        default:
            return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
}

export default function SupportTicketList({
    tickets,
    loading,
    onSelectTicket,
    onOpenCreateModal
}: SupportTicketListProps) {
    return (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Your Support Inquiries</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        History of all support requests and replies submitted from your account.
                    </p>
                </div>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    {tickets.length} {tickets.length === 1 ? 'Ticket' : 'Tickets'}
                </span>
            </div>

            {loading ? (
                <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#047857]" />
                    <span className="text-sm font-medium">Loading your support tickets...</span>
                </div>
            ) : tickets.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#047857] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">No Support Inquiries Logged</h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                        Everything is running smoothly! If you ever have a question regarding an order or pet wellness, click below to open a ticket.
                    </p>
                    <button
                        type="button"
                        onClick={onOpenCreateModal}
                        className="bg-[#047857] hover:bg-[#065f46] active:bg-[#064e3b] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Your First Ticket</span>
                    </button>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {tickets.map((t) => (
                        <div
                            key={t._id}
                            className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 p-3 rounded-2xl transition-colors cursor-pointer"
                            onClick={() => onSelectTicket(t)}
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2.5">
                                    <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                                        #{t.ticketNumber}
                                    </span>
                                    {getStatusBadge(t.status)}
                                    <span className="text-xs text-slate-400 capitalize">
                                        • {t.category.replace('_', ' ')}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-800 text-sm">{t.subject}</h4>
                                <p className="text-xs text-slate-500 line-clamp-1">
                                    {t.messages?.[t.messages.length - 1]?.message}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <div className="text-right text-[11px] text-slate-400">
                                    <span>{new Date(t.updatedAt).toLocaleDateString()}</span>
                                    <span className="block">{t.messages?.length || 0} messages</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
