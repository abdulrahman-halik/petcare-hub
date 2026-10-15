'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Headphones,
    Plus,
    Search,
    MessageSquare,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
    Send,
    Phone,
    Mail,
    ShieldAlert,
    RefreshCw,
    X,
    CornerDownRight
} from 'lucide-react';
import axios from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthContext';

export default function CustomerSupportPage() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTicket, setActiveTicket] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // New Ticket Form State
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('order_inquiry');
    const [priority, setPriority] = useState('medium');
    const [orderNumber, setOrderNumber] = useState('');
    const [petName, setPetName] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Ticket Reply State
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    const fetchMyTickets = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/support/my-tickets');
            setTickets(data?.data?.tickets || []);
            // If active ticket is open, update its messages
            if (activeTicket) {
                const refreshed = data?.data?.tickets?.find((t: any) => t._id === activeTicket._id);
                if (refreshed) setActiveTicket(refreshed);
            }
        } catch (err) {
            console.error('Error fetching tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyTickets();
        }
    }, [user]);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const { data } = await axios.post('/support/tickets', {
                subject,
                category,
                priority,
                orderNumber,
                petName,
                message
            });

            setIsCreateModalOpen(false);
            setSubject('');
            setMessage('');
            setOrderNumber('');
            setPetName('');
            await fetchMyTickets();
            if (data?.data?.ticket) {
                setActiveTicket(data.data.ticket);
            }
        } catch (err: any) {
            setSubmitError(err.response?.data?.message || 'Failed to file support ticket.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() || !activeTicket) return;

        setIsReplying(true);
        try {
            const { data } = await axios.post(`/support/tickets/${activeTicket.ticketNumber}/messages`, {
                message: replyText.trim()
            });
            setActiveTicket(data.data.ticket);
            setReplyText('');
            // update in list
            setTickets(prev => prev.map(t => t.ticketNumber === data.data.ticket.ticketNumber ? data.data.ticket : t));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to send reply.');
        } finally {
            setIsReplying(false);
        }
    };

    const getStatusBadge = (status: string) => {
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
    };

    return (
        <div className="space-y-8">
            {/* Top Header Card */}
            <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-emerald-200 text-xs font-semibold mb-3">
                            <Headphones className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Dedicated Pet Parent Assistance</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black">Help & Support Desk</h1>
                        <p className="mt-1 text-emerald-100/80 text-sm max-w-xl leading-relaxed">
                            Track ongoing inquiries, consult certified veterinarians, or request expedited fulfillment updates.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Support Ticket</span>
                        </button>
                        <button
                            type="button"
                            onClick={fetchMyTickets}
                            className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Contact & Emergency Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Toll-Free Phone</span>
                        <span className="text-sm font-bold text-slate-800">+1 (800) 555-PAWS</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Concierge Email</span>
                        <span className="text-sm font-bold text-slate-800">support@petcarehub.com</span>
                    </div>
                </div>

                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs text-rose-800">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">Vet Emergency?</span>
                        <span className="text-xs font-semibold">Immediate 24/7 care clinics advice</span>
                    </div>
                </div>
            </div>

            {/* Support Tickets Section */}
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
                        <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                        <span className="text-sm font-medium">Loading your support tickets...</span>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="text-center py-16 px-4 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">No Support Inquiries Logged</h3>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                            Everything is running smoothly! If you ever have a question regarding an order or pet wellness, click below to open a ticket.
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
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
                                onClick={() => setActiveTicket(t)}
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

            {/* Create Ticket Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Create Support Ticket</h3>
                                <p className="text-xs text-slate-500">Our care team will review and respond shortly.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {submitError && (
                            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{submitError}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateTicket} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    >
                                        <option value="order_inquiry">Order & Tracking</option>
                                        <option value="product_question">Product & Diet Advice</option>
                                        <option value="veterinary_advice">Veterinary Care</option>
                                        <option value="billing_payment">Payment / Billing</option>
                                        <option value="general">General Support</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Priority
                                    </label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Order # (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. ORD-12345"
                                        value={orderNumber}
                                        onChange={(e) => setOrderNumber(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Pet Name (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Milo"
                                        value={petName}
                                        onChange={(e) => setPetName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Subject <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Brief summary of your question"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Message Details <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Please provide details so we can help quickly..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                                >
                                    {isSubmitting ? 'Creating...' : 'Submit Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Ticket Thread Modal */}
            {activeTicket && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-sm text-slate-900">
                                        #{activeTicket.ticketNumber}
                                    </span>
                                    {getStatusBadge(activeTicket.status)}
                                </div>
                                <h3 className="text-base font-bold text-slate-800 mt-1">
                                    {activeTicket.subject}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveTicket(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Thread */}
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                            {activeTicket.messages?.map((msg: any, i: number) => {
                                const isStaff = msg.sender === 'support';
                                const isSystem = msg.sender === 'system';
                                return (
                                    <div
                                        key={i}
                                        className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                                            isStaff
                                                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 ml-6'
                                                : isSystem
                                                ? 'bg-slate-50 border-slate-200 text-slate-700'
                                                : 'bg-white border-slate-200 text-slate-900 mr-6'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between text-[11px] mb-1 font-bold text-slate-600">
                                            <span>
                                                {isStaff ? '🧑‍⚕️ ' : isSystem ? '🤖 ' : '👤 '}
                                                {msg.senderName}
                                            </span>
                                            <span className="text-slate-400 font-normal">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="whitespace-pre-line text-xs">{msg.message}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Reply Form */}
                        {activeTicket.status !== 'closed' && (
                            <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 flex gap-2 shrink-0">
                                <input
                                    type="text"
                                    required
                                    placeholder="Type your follow-up reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                                <button
                                    type="submit"
                                    disabled={isReplying || !replyText.trim()}
                                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                                >
                                    {isReplying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                    <span>Send</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
