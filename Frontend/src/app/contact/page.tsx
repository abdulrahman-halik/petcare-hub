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
    ShieldAlert
} from 'lucide-react';

type AudienceType = 'b2c' | 'b2b' | 'social' | 'entrepreneur';

interface AudienceDetail {
    id: AudienceType;
    label: string;
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
    const [selectedAudience, setSelectedAudience] = useState<AudienceType>('b2c');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        petName: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const currentAudience = audienceDetails[selectedAudience];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate seamless client dispatch
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 600);
    };

    const handleResetForm = () => {
        setFormData({
            name: '',
            email: '',
            petName: '',
            subject: '',
            message: ''
        });
        setIsSubmitted(false);
    };

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
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
                        Get In Touch With <br />
                        <span className="bg-linear-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                            The PetCare Hub Team
                        </span>
                    </h1>

                    <p className="mt-4 text-base sm:text-lg text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
                        Whether you are a pet parent, verified supplier, event organizer, or pet entrepreneur—we are here to support your journey.
                    </p>
                </div>
            </section>

            {/* 2. Main Contact Grid */}
            <section className="py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                        className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
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
                            {/* Interactive Pet Showcase Card for Contact */}
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
                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-[11px] font-semibold text-slate-500 uppercase">Support Email</span>
                                            <a href="mailto:support@petcarehub.com" className="font-semibold text-emerald-700 hover:underline">
                                                support@petcarehub.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                                        <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-[11px] font-semibold text-slate-500 uppercase">Phone & Toll-Free</span>
                                            <a href="tel:+18007382273" className="font-semibold text-slate-900 hover:text-emerald-700">
                                                +1 (800) 738-CARE (2273)
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                                        <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-[11px] font-semibold text-slate-500 uppercase">Operating Hours</span>
                                            <span className="font-medium text-slate-700">Mon - Sat: 8:00 AM - 8:00 PM EST</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-[11px] font-semibold text-slate-500 uppercase">Headquarters</span>
                                            <span className="font-medium text-slate-700">PetCare Hub Plaza, 142 Pawprint Blvd, Austin, TX</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Urgent Veterinary Callout */}
                                <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-rose-900">
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

                        {/* Interactive Contact Form (7 cols) */}
                        <div className="lg:col-span-7">
                            <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-xs">
                                {isSubmitted ? (
                                    <div className="text-center py-12 px-4 space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-bounce">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900">
                                            Message Received! 🐾
                                        </h3>
                                        <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                                            Thank you, <span className="font-semibold text-slate-800">{formData.name || 'Friend'}</span>. Your inquiry for <span className="font-semibold text-emerald-700">{currentAudience.label}</span> has been dispatched to our care team.
                                        </p>
                                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl max-w-md mx-auto text-xs text-emerald-800">
                                            A confirmation has been logged. Our specialists will respond to <span className="font-semibold">{formData.email}</span> shortly.
                                        </div>
                                        <div className="pt-4 flex justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={handleResetForm}
                                                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                                            >
                                                Send Another Message
                                            </button>
                                            <Link
                                                href="/products"
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                                            >
                                                Return to Catalog
                                            </Link>
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
                                                All fields secure
                                            </span>
                                        </div>

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
                                                    <span>Transmitting Inquiry...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    <span>Send Inquiry Message</span>
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
                                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-slate-900 hover:bg-slate-100/60 transition-colors text-sm sm:text-base gap-4"
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
