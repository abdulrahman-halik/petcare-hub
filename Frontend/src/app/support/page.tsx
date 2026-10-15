'use client';

import React, { useState, useEffect } from 'react';
import {
    Headphones,
    Plus,
    Phone,
    Mail,
    ShieldAlert,
    RefreshCw
} from 'lucide-react';
import axios from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthContext';
import SupportTicketList from '@/components/support/SupportTicketList';
import SupportTicketChat from '@/components/support/SupportTicketChat';
import CreateTicketModal from '@/components/support/CreateTicketModal';

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
            const fetched = data?.data?.tickets || [];
            setTickets(fetched);
            if (activeTicket) {
                const refreshed = fetched.find((t: any) => t._id === activeTicket._id);
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
            setTickets((prev) =>
                prev.map((t) => (t.ticketNumber === data.data.ticket.ticketNumber ? data.data.ticket : t))
            );
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to send reply.');
        } finally {
            setIsReplying(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Top Header Card */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-full text-[#047857] text-xs font-semibold mb-3 border border-emerald-200">
                            <Headphones className="w-3.5 h-3.5 text-[#047857]" />
                            <span>Dedicated Pet Parent Assistance</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Help & Support Desk</h1>
                        <p className="mt-1 text-slate-600 text-sm max-w-xl leading-relaxed">
                            Track ongoing inquiries, consult certified veterinarians, or request expedited fulfillment updates.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Support Ticket</span>
                        </button>
                        <button
                            type="button"
                            onClick={fetchMyTickets}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
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
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#047857] flex items-center justify-center shrink-0">
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
            <SupportTicketList
                tickets={tickets}
                loading={loading}
                onSelectTicket={setActiveTicket}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />

            {/* Create Ticket Modal */}
            <CreateTicketModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateTicket}
                isSubmitting={isSubmitting}
                submitError={submitError}
                category={category}
                onCategoryChange={setCategory}
                priority={priority}
                onPriorityChange={setPriority}
                orderNumber={orderNumber}
                onOrderNumberChange={setOrderNumber}
                petName={petName}
                onPetNameChange={setPetName}
                subject={subject}
                onSubjectChange={setSubject}
                message={message}
                onMessageChange={setMessage}
            />

            {/* View Ticket Thread Modal */}
            <SupportTicketChat
                activeTicket={activeTicket}
                onClose={() => setActiveTicket(null)}
                replyText={replyText}
                onReplyTextChange={setReplyText}
                onSendReply={handleSendReply}
                isReplying={isReplying}
            />
        </div>
    );
}
