'use client';

import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    submitError: string;
    category: string;
    onCategoryChange: (v: string) => void;
    priority: string;
    onPriorityChange: (v: string) => void;
    orderNumber: string;
    onOrderNumberChange: (v: string) => void;
    petName: string;
    onPetNameChange: (v: string) => void;
    subject: string;
    onSubjectChange: (v: string) => void;
    message: string;
    onMessageChange: (v: string) => void;
}

export default function CreateTicketModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    submitError,
    category,
    onCategoryChange,
    priority,
    onPriorityChange,
    orderNumber,
    onOrderNumberChange,
    petName,
    onPetNameChange,
    subject,
    onSubjectChange,
    message,
    onMessageChange
}: CreateTicketModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Create Support Ticket</h3>
                        <p className="text-xs text-slate-500">Our care team will review and respond shortly.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
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

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => onCategoryChange(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
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
                                onChange={(e) => onPriorityChange(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
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
                                onChange={(e) => onOrderNumberChange(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
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
                                onChange={(e) => onPetNameChange(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
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
                            onChange={(e) => onSubjectChange(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
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
                            onChange={(e) => onMessageChange(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857] resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2.5 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#047857] hover:bg-[#065f46] active:bg-[#064e3b] disabled:bg-slate-300 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                            {isSubmitting ? 'Creating...' : 'Submit Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
