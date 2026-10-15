'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    MessageSquare,
    X,
    Send,
    HelpCircle,
    CheckCircle2,
    Search,
    ChevronRight,
    Headphones,
    Sparkles,
    ShieldAlert,
    Copy,
    Check,
    RefreshCw
} from 'lucide-react';
import axios from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthContext';

const QUICK_FAQS = [
    {
        q: 'How long does shipping take?',
        a: 'Standard orders arrive in 2-4 business days. Express shipping is free for all orders over $49.'
    },
    {
        q: 'What is your pet return policy?',
        a: 'We offer a 30-day 100% happiness guarantee. If your dog or cat dislikes the food or treats, we will replace or refund it.'
    },
    {
        q: 'How do I track my active shipment?',
        a: 'Visit your "My Orders" tab in the dashboard or click your order number for real-time tracking.'
    },
    {
        q: 'Are your veterinary medicines genuine?',
        a: 'Yes, 100% of wellness and pharmaceutical items are sourced directly from licensed, certified veterinary distributors.'
    }
];

export default function CustomerSupportWidget() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'faq' | 'ticket' | 'track'>('faq');

    // Quick Ticket State
    const [ticketSubject, setTicketSubject] = useState('');
    const [ticketCategory, setTicketCategory] = useState('order_inquiry');
    const [ticketMessage, setTicketMessage] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdTicket, setCreatedTicket] = useState<any>(null);
    const [ticketError, setTicketError] = useState('');
    const [copiedId, setCopiedId] = useState(false);

    // Quick Track State
    const [trackId, setTrackId] = useState('');
    const [isTracking, setIsTracking] = useState(false);
    const [trackedResult, setTrackedResult] = useState<any>(null);
    const [trackError, setTrackError] = useState('');

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTicketError('');

        try {
            const { data } = await axios.post('/support/tickets', {
                name: user?.name || guestName,
                email: user?.email || guestEmail,
                subject: ticketSubject,
                category: ticketCategory,
                message: ticketMessage,
                priority: 'medium'
            });

            if (data?.data?.ticket) {
                setCreatedTicket(data.data.ticket);
                setTicketSubject('');
                setTicketMessage('');
            }
        } catch (err: any) {
            setTicketError(err.response?.data?.message || 'Failed to submit ticket. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuickTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackId.trim()) return;

        setIsTracking(true);
        setTrackError('');
        try {
            const { data } = await axios.get(`/support/track/${trackId.trim().toUpperCase()}`);
            setTrackedResult(data.data.ticket);
        } catch (err: any) {
            setTrackedResult(null);
            setTrackError(err.response?.data?.message || 'Ticket not found.');
        } finally {
            setIsTracking(false);
        }
    };

    const copyTicket = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
    };

    return (
        <aside aria-label="Customer Support Concierge" className="fixed bottom-6 right-6 z-50">
            {/* Popover Card */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-[360px] sm:w-[400px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[580px] transition-all animate-in fade-in slide-in-from-bottom-4">
                    {/* Header */}
                    <div className="bg-linear-to-r from-emerald-800 to-teal-800 text-white p-4.5 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                                <Headphones className="w-5 h-5 text-emerald-300" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                                    <span>PetCare Concierge</span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                </h3>
                                <p className="text-[11px] text-emerald-100/80">
                                    Live Pet Care & Order Support
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Navigation Bar */}
                    <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 text-xs font-semibold gap-1 shrink-0">
                        <button
                            type="button"
                            onClick={() => setActiveTab('faq')}
                            className={`flex-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
                                activeTab === 'faq'
                                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Top Answers
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('ticket')}
                            className={`flex-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
                                activeTab === 'ticket'
                                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            New Ticket
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('track')}
                            className={`flex-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
                                activeTab === 'track'
                                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Track
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs">
                        {activeTab === 'faq' && (
                            <div className="space-y-2.5">
                                <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-emerald-900 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Instant answers to common pet parent questions:</span>
                                </div>

                                {QUICK_FAQS.map((faq, i) => (
                                    <div key={i} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                                        <p className="font-bold text-slate-800">{faq.q}</p>
                                        <p className="text-slate-600 leading-relaxed text-[11.5px]">{faq.a}</p>
                                    </div>
                                ))}

                                <div className="pt-2 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('ticket')}
                                        className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>Need more help? Open a direct ticket</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ticket' && (
                            <div>
                                {createdTicket ? (
                                    <div className="text-center py-4 space-y-3">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-black text-slate-900 text-sm">Ticket Logged!</h4>
                                        <p className="text-slate-600 text-[11px] leading-relaxed">
                                            Your support reference number has been created:
                                        </p>
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
                                            <span className="font-mono font-bold text-emerald-950 text-xs">
                                                {createdTicket.ticketNumber}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => copyTicket(createdTicket.ticketNumber)}
                                                className="p-1 hover:bg-emerald-100 rounded-md text-emerald-800 transition-colors"
                                            >
                                                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTrackId(createdTicket.ticketNumber);
                                                setActiveTab('track');
                                                setCreatedTicket(null);
                                            }}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl transition-all cursor-pointer"
                                        >
                                            Track Progress Now
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleCreateTicket} className="space-y-3">
                                        {ticketError && (
                                            <div className="p-2 bg-rose-50 text-rose-700 rounded-lg text-[11px]">
                                                {ticketError}
                                            </div>
                                        )}

                                        {!user && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Your Name *"
                                                    value={guestName}
                                                    onChange={(e) => setGuestName(e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                />
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="Your Email *"
                                                    value={guestEmail}
                                                    onChange={(e) => setGuestEmail(e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                />
                                            </div>
                                        )}

                                        <select
                                            value={ticketCategory}
                                            onChange={(e) => setTicketCategory(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        >
                                            <option value="order_inquiry">Order & Tracking Inquiry</option>
                                            <option value="product_question">Product & Ingredient Advice</option>
                                            <option value="veterinary_advice">Veterinary Consultation</option>
                                            <option value="billing_payment">Billing or Payment Help</option>
                                            <option value="b2b_supplier">Supplier Partnership</option>
                                            <option value="general">General Question</option>
                                        </select>

                                        <input
                                            type="text"
                                            required
                                            placeholder="Subject *"
                                            value={ticketSubject}
                                            onChange={(e) => setTicketSubject(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        />

                                        <textarea
                                            required
                                            rows={3}
                                            placeholder="How can our care specialists assist you?"
                                            value={ticketMessage}
                                            onChange={(e) => setTicketMessage(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                                        />

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            {isSubmitting ? (
                                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Send className="w-3.5 h-3.5" />
                                            )}
                                            <span>Send to Support</span>
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {activeTab === 'track' && (
                            <div className="space-y-3">
                                <form onSubmit={handleQuickTrack} className="flex gap-1.5">
                                    <input
                                        type="text"
                                        placeholder="Ticket ID (e.g. TKT-xxx)"
                                        value={trackId}
                                        onChange={(e) => setTrackId(e.target.value)}
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-mono uppercase focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isTracking || !trackId.trim()}
                                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
                                    >
                                        {isTracking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                                    </button>
                                </form>

                                {trackError && (
                                    <p className="text-rose-600 text-[11px] p-2 bg-rose-50 rounded-lg">{trackError}</p>
                                )}

                                {trackedResult && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono font-bold text-slate-800">
                                                #{trackedResult.ticketNumber}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                {trackedResult.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="font-semibold text-slate-900 text-xs truncate">
                                            {trackedResult.subject}
                                        </p>
                                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                                            {trackedResult.messages?.map((m: any, i: number) => (
                                                <div key={i} className="p-2 rounded-lg bg-white border border-slate-200 text-[11px]">
                                                    <span className="font-bold block text-slate-700">{m.senderName}:</span>
                                                    <p className="text-slate-600">{m.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer Contact Info */}
                    <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 text-center flex items-center justify-between px-4 shrink-0">
                        <span>Helpline: +1 (800) 555-PAWS</span>
                        <Link href="/contact" onClick={() => setIsOpen(false)} className="text-emerald-700 font-bold hover:underline">
                            Full Help Desk &rarr;
                        </Link>
                    </div>
                </div>
            )}

            {/* Floating Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex items-center gap-2.5 bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-full shadow-lg shadow-emerald-700/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Customer Support & Concierge"
            >
                <div className="relative">
                    <Headphones className="w-5 h-5 text-emerald-200 group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-emerald-700 animate-ping" />
                </div>
                <span className="hidden sm:inline">PetCare Support</span>
            </button>
        </aside>
    );
}
