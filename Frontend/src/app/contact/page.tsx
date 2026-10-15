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
    ShieldAlert,
    MessageSquare
} from 'lucide-react';

import axios from '@/lib/axiosConfig';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [ticketNumber, setTicketNumber] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const { data } = await axios.post('/support/tickets', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone || undefined,
                subject: formData.subject,
                message: formData.message,
                category: 'general'
            });

            if (data?.data?.ticket?.ticketNumber) {
                setTicketNumber(data.data.ticket.ticketNumber);
            }
            setIsSubmitted(true);
        } catch (err: any) {
            console.error('Error submitting contact inquiry:', err);
            setErrorMessage(err.response?.data?.message || 'Failed to submit your message. Please try again or email us directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
        setTicketNumber(null);
        setErrorMessage(null);
        setIsSubmitted(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/60 text-slate-900">
            {/* Header Banner */}
            <section className="relative overflow-hidden bg-emerald-50 text-slate-900 py-14 sm:py-20 border-b border-emerald-100/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white border border-emerald-200 text-[#047857] text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full shadow-2xs mb-6">
                        <Sparkles className="w-4 h-4 text-[#047857]" />
                        <span>We’re Here to Help You & Your Pets</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15] max-w-3xl mx-auto text-slate-900">
                        Get In Touch With <br />
                        <span className="text-[#047857]">
                            The PetCare Hub Team
                        </span>
                    </h1>

                    <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed font-normal">
                        Have questions about our pet products, orders, or wellness services? Send us a message and our support specialists will respond promptly.
                    </p>
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Contact Information & Channels (5 cols) */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xs">
                                <div>
                                    <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full mb-3">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>Direct Channels</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Reach Out Directly</h2>
                                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                        Our dedicated support team is available six days a week to answer all inquiries.
                                    </p>
                                </div>

                                <div className="space-y-3.5 text-xs sm:text-sm">
                                    <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Email Us</span>
                                            <a href="mailto:support@petcarehub.com" className="font-semibold text-emerald-700 hover:underline">
                                                support@petcarehub.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Toll-Free Phone</span>
                                            <a href="tel:+18007382273" className="font-semibold text-slate-900 hover:text-emerald-700">
                                                011 2 738 273
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                        <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Support Hours</span>
                                            <span className="font-medium text-slate-700">Monday - Friday: 8:00 AM - 8:00 PM IST</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Headquarters</span>
                                            <span className="font-medium text-slate-700">Sri Dharmarama Road, Ratmalana 10390, Colombo, Sri Lanka</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-emerald-50/80 border border-emerald-100 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <span>Fast response pledge: We typically reply within 1-2 hours during business hours.</span>
                                </div>
                            </div>

                            {/* Medical Emergency Alert Notice */}
                            <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-3xl flex items-start gap-3 text-xs text-rose-900">
                                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold block text-sm">Medical Emergencies Notice</span>
                                    <p className="mt-1 text-rose-800 leading-relaxed">
                                        If your pet has ingested a toxic substance or requires immediate emergency medical care, please contact your local 24/7 veterinary clinic right away.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form (7 cols) */}
                        <div className="lg:col-span-7">
                            <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-xs">
                                {isSubmitted ? (
                                    <div className="text-center py-12 px-4 space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-bounce">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900">
                                            Message Sent Successfully! 🐾
                                        </h3>
                                        {ticketNumber && (
                                            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-800">
                                                <span>Ticket Reference:</span>
                                                <span className="font-mono font-bold text-emerald-900">{ticketNumber}</span>
                                            </div>
                                        )}
                                        <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                                            Thank you, <span className="font-semibold text-slate-800">{formData.name || 'Friend'}</span>. We have received your inquiry and our team will get in touch with you at <span className="font-semibold text-slate-800">{formData.email}</span> soon.
                                        </p>
                                        <div className="pt-4 flex flex-wrap justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={handleResetForm}
                                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                                            >
                                                Send Another Message
                                            </button>
                                            <Link
                                                href="/products"
                                                className="bg-[#047857] hover:bg-[#065f46] active:bg-[#064e3b] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs"
                                            >
                                                Explore Products
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="pb-4 border-b border-slate-100">
                                            <h2 className="text-2xl font-bold text-slate-900">Send us a Message</h2>
                                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                                Fill out the form below and we will get back to you as soon as possible.
                                            </p>
                                        </div>

                                        {errorMessage && (
                                            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                                                {errorMessage}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                    Full Name <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    id="contact-name"
                                                    type="text"
                                                    required
                                                    placeholder="Abdul Rahman"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/15 focus:border-[#047857] transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                    Email Address <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    id="contact-email"
                                                    type="email"
                                                    required
                                                    placeholder="abdul@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/15 focus:border-[#047857] transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="contact-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                    Phone Number <span className="text-slate-400 text-[11px]">(Optional)</span>
                                                </label>
                                                <input
                                                    id="contact-phone"
                                                    type="tel"
                                                    placeholder="077 738 2273"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/15 focus:border-[#047857] transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                    Subject <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    id="contact-subject"
                                                    type="text"
                                                    required
                                                    placeholder="Product question, order support, etc."
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/15 focus:border-[#047857] transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Message <span className="text-rose-500">*</span>
                                            </label>
                                            <textarea
                                                id="contact-message"
                                                required
                                                rows={5}
                                                placeholder="Tell us what you need help with..."
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/15 focus:border-[#047857] transition-all resize-y"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-[#047857] hover:bg-[#065f46] active:bg-[#064e3b] disabled:opacity-60 text-white font-semibold text-sm py-3 px-6 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Sending Message...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    <span>Send Message</span>
                                                </>
                                            )}
                                        </button>

                                        <p className="text-[11px] text-center text-slate-500">
                                            We respect your privacy. No spam. You will typically receive a reply within 24 hours.
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
