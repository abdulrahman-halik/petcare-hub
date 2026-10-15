'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    CheckCircle2,
    Sparkles,
    Building2,
    Users,
    UsersRound,
    Rocket,
    AlertCircle,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    ShieldAlert,
    Search,
    MessageSquare,
    Copy,
    Check,
    RefreshCw,
    CornerDownRight
} from 'lucide-react';
import axios from '@/lib/axiosConfig';

type AudienceType = 'b2c' | 'b2b' | 'social' | 'entrepreneur';

interface AudienceDetail {
    id: AudienceType;
    label: string;
    category: string;
    icon: React.ElementType;
    badge: string;
    dogName: string;
    dogBreed: string;
    dogImageUrl: string;
    dogQuote: string;
    supportPledge: string;
    placeholderSubject: string;
}

const audienceDetails: Record<AudienceType, AudienceDetail> = {
    b2c: {
        id: 'b2c',
        label: 'Pet Parent (B2C)',
        category: 'order_inquiry',
        icon: Users,
        badge: 'Pet Care & Order Help',
        dogName: 'Cooper',
        dogBreed: 'Golden Retriever',
        dogImageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
        dogQuote: '“Need advice on sensitive stomach food or tracking your pup’s toy shipment? We’re on it!”',
        supportPledge: 'Avg. reply time: Under 1 hour for pet parent questions.',
        placeholderSubject: 'Order inquiry or product recommendation'
    },
    b2b: {
        id: 'b2b',
        label: 'Business & Supplier (B2B)',
        category: 'b2b_supplier',
        icon: Building2,
        badge: 'Wholesale & Clinic Supply',
        dogName: 'Duke',
        dogBreed: 'German Shepherd',
        dogImageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80',
        dogQuote: '“Our commercial accounts team helps suppliers scale catalog distribution with zero friction.”',
        supportPledge: 'Dedicated account representative assigned within 2 business hours.',
        placeholderSubject: 'Wholesale partnership or catalog supplier onboarding'
    },
    social: {
        id: 'social',
        label: 'Social Gatherings & Events',
        category: 'social_events',
        icon: UsersRound,
        badge: 'Community & Meetups',
        dogName: 'Milo',
        dogBreed: 'Playful Corgi',
        dogImageUrl: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=800&q=80',
        dogQuote: '“Planning a breed meetup, adoption drive, or charity dog walk? We love supporting community events!”',
        supportPledge: 'Event sponsorship review and goodie bag coordination in 24 hours.',
        placeholderSubject: 'Local dog park meetup or adoption event collaboration'
    },
    entrepreneur: {
        id: 'entrepreneur',
        label: 'Pet Entrepreneur',
        category: 'entrepreneur_partner',
        icon: Rocket,
        badge: 'Startups & Innovators',
        dogName: 'Luna',
        dogBreed: 'Border Collie',
        dogImageUrl: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=800&q=80',
        dogQuote: '“Crafting artisanal treats, mobile grooming, or pet health tech? Let’s build something together.”',
        supportPledge: 'Founder-to-founder review and marketplace partnership onboarding.',
        placeholderSubject: 'Pet business collaboration or artisanal brand feature'
    }
};

const faqs = [
    {
        question: 'How quickly does the PetCare Hub support team respond?',
        answer: 'Our customer support team answers pet parent inquiries within 1 to 2 hours during active hours (7 AM - 9 PM EST). For emergency orders or supplier inquiries, dedicated priority channels are monitored 24/7.'
    },
    {
        question: 'How do businesses and clinics register as verified suppliers?',
        answer: 'Suppliers can submit their credentials via the Contact Us form (selecting B2B) or through our Supplier Registration portal. We verify licenses, certifications, and product safety compliance within 48 hours.'
    },
    {
        question: 'Can PetCare Hub sponsor or provide supplies for local pet gatherings?',
        answer: 'Yes! We actively support local pet meetups, adoption weekends, and rescue fundraisers with sample packs, hydration stations, and co-marketing across our digital channels.'
    },
    {
        question: 'What is your guarantee on veterinary and nutrition products?',
        answer: 'All consumables and veterinary essentials undergo strict batch inspections. If your pet dislikes a product or experiences sensitivity, we offer a 100% money-back guarantee within 30 days.'
    }
];

export default function ContactPage() {
    const [activeTab, setActiveTab] = useState<'inquiry' | 'track'>('inquiry');
    const [selectedAudience, setSelectedAudience] = useState<AudienceType>('b2c');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        petName: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedTicket, setSubmittedTicket] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [copiedTicketId, setCopiedTicketId] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    // Ticket Tracking State
    const [trackTicketNumber, setTrackTicketNumber] = useState('');
    const [isTracking, setIsTracking] = useState(false);
    const [trackedTicket, setTrackedTicket] = useState<any>(null);
    const [trackError, setTrackError] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const [isSendingReply, setIsSendingReply] = useState(false);

    const currentAudience = audienceDetails[selectedAudience];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const { data } = await axios.post('/support/tickets', {
                name: formData.name,
                email: formData.email,
                petName: formData.petName,
                subject: formData.subject,
                message: formData.message,
                category: currentAudience.category,
                priority: 'medium'
            });

            if (data?.data?.ticket) {
                setSubmittedTicket(data.data.ticket);
            }
        } catch (err: any) {
            console.error('Support ticket error:', err);
            setErrorMessage(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetForm = () => {
        setFormData({
            name: '',
            email: '',
            petName: '',
            subject: '',
            message: ''
        });
        setSubmittedTicket(null);
        setErrorMessage('');
    };

    const handleTrackSubmit = async (e?: React.FormEvent, customTicketId?: string) => {
        if (e) e.preventDefault();
        const idToSearch = customTicketId || trackTicketNumber;
        if (!idToSearch.trim()) return;

        setIsTracking(true);
        setTrackError('');
        try {
            const { data } = await axios.get(`/support/track/${idToSearch.trim().toUpperCase()}`);
            setTrackedTicket(data.data.ticket);
            if (customTicketId) {
                setTrackTicketNumber(customTicketId);
                setActiveTab('track');
            }
        } catch (err: any) {
            setTrackedTicket(null);
            setTrackError(err.response?.data?.message || 'No ticket found with this reference number.');
        } finally {
            setIsTracking(false);
        }
    };

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim() || !trackedTicket) return;

        setIsSendingReply(true);
        try {
            const { data } = await axios.post(`/support/tickets/${trackedTicket.ticketNumber}/messages`, {
                message: replyMessage.trim()
            });
            setTrackedTicket(data.data.ticket);
            setReplyMessage('');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to send message reply.');
        } finally {
            setIsSendingReply(false);
        }
    };

    const copyTicketToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedTicketId(true);
        setTimeout(() => setCopiedTicketId(false), 2000);
    };

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Open</span>;
            case 'in_progress':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">In Progress</span>;
            case 'resolved':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Resolved</span>;
            case 'closed':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Closed</span>;
            default:
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/60 text-slate-900">
            {/* 1. Header Banner */}
            <section className="relative overflow-hidden bg-linear-to-br from-emerald-900 via-teal-900 to-slate-950 text-white py-14 sm:py-20">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [bg-size:16px_16px] pointer-events-none" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 -right-24 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full backdrop-blur-md mb-6">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Dedicated Assistance for Paws, People & Partners</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15] max-w-3xl mx-auto">
                        Customer Support & Concierge <br />
                        <span className="bg-linear-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                            The PetCare Hub Team
                        </span>
                    </h1>

                    <p className="mt-4 text-base sm:text-lg text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
                        Need order help, nutrition advice, or product support? Submit a direct inquiry or track your active support ticket below.
                    </p>

                    {/* Mode Navigation Tabs */}
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('inquiry')}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                                activeTab === 'inquiry'
                                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                                    : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
                            }`}
                        >
                            <Mail className="w-4 h-4" />
                            <span>Create New Ticket</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('track')}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                                activeTab === 'track'
                                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                                    : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
                            }`}
                        >
                            <Search className="w-4 h-4" />
                            <span>Track Existing Ticket</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. Main Content Grid */}
            <section className="py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {activeTab === 'inquiry' ? (
                        <>
                            {/* Audience Selector Tabs */}
                            <div className="mb-10 text-center">
                                <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-100/70 px-3 py-1 rounded-full mb-3 inline-block">
                                    Step 1: Select Your Inquiry Type
                                </span>
                                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-2">
                                    {(Object.keys(audienceDetails) as AudienceType[]).map((key) => {
                                        const aud = audienceDetails[key];
                                        const isSelected = selectedAudience === key;
                                        const IconComponent = aud.icon;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setSelectedAudience(key)}
                                                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                                                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                                                }`}
                                            >
                                                <IconComponent className="w-4 h-4" />
                                                <span>{aud.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Interactive Dog Companion & Support Info (5 cols) */}
                                <div className="lg:col-span-5 space-y-6">
                                    {/* Pet Showcase Card */}
                                    <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
                                        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900 group">
                                            <img
                                                src={currentAudience.dogImageUrl}
                                                alt={`${currentAudience.dogName} the ${currentAudience.dogBreed}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
                                            <div className="absolute top-4 left-4 bg-emerald-600/95 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                                                {currentAudience.badge}
                                            </div>
                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <span className="text-xs text-emerald-300 font-semibold tracking-wide uppercase block">
                                                    Meet Our Concierge Companion
                                                </span>
                                                <p className="text-lg font-bold text-white">
                                                    {currentAudience.dogName} • {currentAudience.dogBreed}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-6 space-y-4">
                                            <p className="text-sm text-slate-700 italic leading-relaxed bg-slate-50 border border-slate-100 rounded-2xl p-4">
                                                {currentAudience.dogQuote}
                                            </p>

                                            <div className="flex items-center gap-2.5 text-xs text-emerald-800 font-medium bg-emerald-50/80 border border-emerald-100 rounded-xl p-3">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>{currentAudience.supportPledge}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Direct Contact Channels */}
                                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs">
                                        <h3 className="text-base font-bold text-slate-900">Direct Contact Channels</h3>

                                        <div className="space-y-3 text-xs sm:text-sm">
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[11px] font-medium">Customer Support Email</span>
                                                    <span className="font-semibold text-slate-800">support@petcarehub.com</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 text-slate-600">
                                                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[11px] font-medium">Toll-Free Helpline</span>
                                                    <span className="font-semibold text-slate-800">+1 (800) 555-PAWS (7297)</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 text-slate-600">
                                                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[11px] font-medium">Desk Hours</span>
                                                    <span className="font-semibold text-slate-800">Mon - Sun: 7:00 AM - 9:00 PM EST</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-slate-100">
                                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
                                                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="font-bold block">Medical Emergencies Notice:</span>
                                                    <p className="mt-0.5 text-rose-800 leading-relaxed">
                                                        If your dog or cat ingested toxic substances, contact your nearest emergency veterinarian clinic immediately.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form / Confirmation Panel (7 cols) */}
                                <div className="lg:col-span-7">
                                    <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-xs">
                                        {submittedTicket ? (
                                            <div className="text-center py-8 px-4 space-y-5">
                                                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
                                                    <CheckCircle2 className="w-8 h-8" />
                                                </div>

                                                <h3 className="text-2xl font-black text-slate-900">
                                                    Support Ticket Registered! 🐾
                                                </h3>

                                                <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                                                    Thank you, <span className="font-semibold text-slate-800">{submittedTicket.name}</span>. Your inquiry has been assigned to our concierge team.
                                                </p>

                                                {/* Live Ticket Reference Card */}
                                                <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl max-w-md mx-auto text-left space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                                                            Your Ticket Reference
                                                        </span>
                                                        {getStatusBadge(submittedTicket.status)}
                                                    </div>

                                                    <div className="flex items-center justify-between bg-white border border-emerald-200/80 px-4 py-2.5 rounded-xl">
                                                        <span className="text-lg font-black font-mono text-emerald-950 tracking-wider">
                                                            {submittedTicket.ticketNumber}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => copyTicketToClipboard(submittedTicket.ticketNumber)}
                                                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                                                            title="Copy Ticket ID"
                                                        >
                                                            {copiedTicketId ? (
                                                                <>
                                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                                    <span className="text-emerald-700">Copied</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="w-3.5 h-3.5" />
                                                                    <span>Copy</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>

                                                    <p className="text-xs text-emerald-900/80 leading-relaxed">
                                                        Keep this reference ID handy. You can track agent responses and reply directly to this ticket.
                                                    </p>
                                                </div>

                                                <div className="pt-4 flex flex-wrap justify-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTrackSubmit(undefined, submittedTicket.ticketNumber)}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Search className="w-4 h-4" />
                                                        <span>Track This Ticket Live</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleResetForm}
                                                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                                                    >
                                                        Send Another Inquiry
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-5">
                                                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-slate-900">Send an Inquiry</h3>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            Tailored for: <span className="font-semibold text-emerald-700">{currentAudience.label}</span>
                                                        </p>
                                                    </div>
                                                    <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2.5 py-1 rounded-lg">
                                                        Ticket Dispatch
                                                    </span>
                                                </div>

                                                {errorMessage && (
                                                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                                                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                                                        <span>{errorMessage}</span>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                            Your Full Name <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="Alex Jordan"
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                            Email Address <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            type="email"
                                                            required
                                                            placeholder="alex@example.com"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                            Pet Name / Organization <span className="text-slate-400 text-[11px]">(Optional)</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. Buddy / Austin Pup Club"
                                                            value={formData.petName}
                                                            onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                            Subject <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder={currentAudience.placeholderSubject}
                                                            value={formData.subject}
                                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                        Message & Inquiry Details <span className="text-rose-500">*</span>
                                                    </label>
                                                    <textarea
                                                        required
                                                        rows={5}
                                                        placeholder={`Tell us how we can help your pets, business, or community event...`}
                                                        value={formData.message}
                                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all resize-y"
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            <span>Creating Support Ticket...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-4 h-4" />
                                                            <span>Submit Support Inquiry</span>
                                                        </>
                                                    )}
                                                </button>

                                                <p className="text-[11px] text-center text-slate-500">
                                                    We respect your privacy. No spam, ever. Guaranteed reply within our support window.
                                                </p>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Ticket Tracking Hub */
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-xs">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Track Your Support Ticket</h3>
                                <p className="text-sm text-slate-600 mb-6">
                                    Enter your ticket reference ID (e.g., <code className="bg-slate-100 px-1.5 py-0.5 rounded-md font-mono text-emerald-800">TKT-xxxx-xxxx</code>) to view the live status, concierge notes, and post follow-up replies.
                                </p>

                                <form onSubmit={(e) => handleTrackSubmit(e)} className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter ticket number (e.g. TKT-9A2F-1024)"
                                            value={trackTicketNumber}
                                            onChange={(e) => setTrackTicketNumber(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-mono text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 uppercase"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isTracking || !trackTicketNumber.trim()}
                                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                                    >
                                        {isTracking ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                <span>Searching...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Search className="w-4 h-4" />
                                                <span>Lookup Ticket</span>
                                            </>
                                        )}
                                    </button>
                                </form>

                                {trackError && (
                                    <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2.5">
                                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                        <span>{trackError}</span>
                                    </div>
                                )}
                            </div>

                            {/* Live Tracked Ticket Details */}
                            {trackedTicket && (
                                <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-xs space-y-6 animate-fade-in">
                                    {/* Ticket Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                                        <div>
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-xl font-black font-mono text-slate-900">
                                                    #{trackedTicket.ticketNumber}
                                                </span>
                                                {getStatusBadge(trackedTicket.status)}
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-800 mt-1">
                                                {trackedTicket.subject}
                                            </h4>
                                            <span className="text-xs text-slate-500">
                                                Created by {trackedTicket.name} • {new Date(trackedTicket.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleTrackSubmit(undefined, trackedTicket.ticketNumber)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" />
                                            <span>Refresh Updates</span>
                                        </button>
                                    </div>

                                    {/* Conversation Stream */}
                                    <div className="space-y-4">
                                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            Conversation History
                                        </h5>

                                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                            {trackedTicket.messages?.map((msg: any, idx: number) => {
                                                const isSystem = msg.sender === 'system';
                                                const isStaff = msg.sender === 'support';
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                                                            isStaff
                                                                ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950 ml-4'
                                                                : isSystem
                                                                ? 'bg-slate-50 border-slate-200 text-slate-700'
                                                                : 'bg-white border-slate-200 text-slate-900 mr-4'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                                            <span className="font-bold">
                                                                {isStaff ? '🧑‍⚕️ ' : isSystem ? '🤖 ' : '👤 '}
                                                                {msg.senderName}
                                                            </span>
                                                            <span className="text-[11px] text-slate-400">
                                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <p className="whitespace-pre-line text-xs sm:text-sm">
                                                            {msg.message}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Customer Reply Box */}
                                    {trackedTicket.status !== 'closed' && (
                                        <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 space-y-3">
                                            <label className="block text-xs font-bold text-slate-700">
                                                Add a Follow-Up Reply:
                                            </label>
                                            <textarea
                                                required
                                                rows={3}
                                                placeholder="Provide more context or reply to our support specialist..."
                                                value={replyMessage}
                                                onChange={(e) => setReplyMessage(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all resize-y"
                                            />
                                            <button
                                                type="submit"
                                                disabled={isSendingReply || !replyMessage.trim()}
                                                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
                                            >
                                                {isSendingReply ? (
                                                    <>
                                                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        <span>Sending Reply...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CornerDownRight className="w-4 h-4" />
                                                        <span>Send Reply</span>
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* 3. Frequently Asked Questions Section */}
            <section className="py-14 bg-white border-t border-slate-200/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            Helpful Answers
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => {
                            const isOpen = openFaqIndex === index;
                            return (
                                <div
                                    key={index}
                                    className="border border-slate-200 rounded-2xl overflow-hidden transition-colors bg-slate-50/50"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-slate-900 hover:bg-slate-100/60 transition-colors text-sm sm:text-base gap-4 cursor-pointer"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>{faq.question}</span>
                                        </span>
                                        {isOpen ? (
                                            <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                                        )}
                                    </button>
                                    {isOpen && (
                                        <div className="px-4 pb-5 pt-1 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
