'use client';

import React, { useState, useEffect } from 'react';
import {
    Headphones,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
    Send,
    RefreshCw,
    X,
    MessageSquare
} from 'lucide-react';
import axios from '@/lib/axiosConfig';

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedTicket, setSelectedTicket] = useState<any>(null);

    // Reply / Status update state
    const [replyText, setReplyText] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchAdminTickets = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (statusFilter !== 'all') params.status = statusFilter;
            if (categoryFilter !== 'all') params.category = categoryFilter;
            if (searchKeyword.trim()) params.search = searchKeyword.trim();

            const { data } = await axios.get('/support/admin/tickets', { params });
            setTickets(data?.data?.tickets || []);
            if (selectedTicket) {
                const updated = data?.data?.tickets?.find((t: any) => t._id === selectedTicket._id);
                if (updated) setSelectedTicket(updated);
            }
        } catch (err) {
            console.error('Failed to load admin support tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminTickets();
    }, [statusFilter, categoryFilter]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchAdminTickets();
    };

    const handleUpdateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket) return;

        setIsUpdating(true);
        try {
            const payload: any = {};
            if (newStatus) payload.status = newStatus;
            if (replyText.trim()) payload.adminNote = replyText.trim();

            const { data } = await axios.patch(`/support/admin/tickets/${selectedTicket.ticketNumber}`, payload);
            setSelectedTicket(data.data.ticket);
            setReplyText('');
            await fetchAdminTickets();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update ticket.');
        } finally {
            setIsUpdating(false);
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
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                        <Headphones className="w-4 h-4" />
                        <span>Support Desk Administration</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">Customer Support Tickets</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Moderate customer and supplier inquiries, assign priority, and reply directly.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchAdminTickets}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer self-start md:self-auto"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh Tickets</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by ticket #, customer name, email, or subject..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                </form>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
                    >
                        <option value="all">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
                    >
                        <option value="all">All Categories</option>
                        <option value="order_inquiry">Order Inquiry</option>
                        <option value="product_question">Product Question</option>
                        <option value="veterinary_advice">Veterinary Care</option>
                        <option value="billing_payment">Billing</option>
                        <option value="b2b_supplier">Supplier B2B</option>
                        <option value="general">General</option>
                    </select>
                </div>
            </div>

            {/* Tickets Table / List */}
            <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
                {loading ? (
                    <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                        <span className="text-xs">Fetching support tickets...</span>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-700">No support tickets match your filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="py-3.5 px-4">Ticket</th>
                                    <th className="py-3.5 px-4">Customer</th>
                                    <th className="py-3.5 px-4">Subject</th>
                                    <th className="py-3.5 px-4">Category</th>
                                    <th className="py-3.5 px-4">Priority</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4">Last Activity</th>
                                    <th className="py-3.5 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                                {tickets.map((t) => (
                                    <tr
                                        key={t._id}
                                        onClick={() => {
                                            setSelectedTicket(t);
                                            setNewStatus(t.status);
                                        }}
                                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                                    >
                                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                                            #{t.ticketNumber}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="font-bold text-slate-900 block">{t.name}</span>
                                            <span className="text-[11px] text-slate-400">{t.email}</span>
                                        </td>
                                        <td className="py-3 px-4 font-bold text-slate-800 max-w-xs truncate">
                                            {t.subject}
                                        </td>
                                        <td className="py-3 px-4 capitalize text-slate-600">
                                            {t.category.replace('_', ' ')}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                                                t.priority === 'urgent'
                                                    ? 'bg-rose-100 text-rose-800'
                                                    : t.priority === 'high'
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : 'bg-slate-100 text-slate-700'
                                            }`}>
                                                {t.priority}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {getStatusBadge(t.status)}
                                        </td>
                                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                                            {new Date(t.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="text-emerald-600 hover:text-emerald-700 font-bold inline-flex items-center gap-1">
                                                Manage <ChevronRight className="w-3.5 h-3.5" />
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Manage Ticket Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-sm text-slate-900">
                                        #{selectedTicket.ticketNumber}
                                    </span>
                                    {getStatusBadge(selectedTicket.status)}
                                </div>
                                <h3 className="text-base font-bold text-slate-800 mt-1">
                                    {selectedTicket.subject}
                                </h3>
                                <p className="text-xs text-slate-400">
                                    From {selectedTicket.name} ({selectedTicket.email}) • Category: {selectedTicket.category}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedTicket(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Message Stream */}
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                            {selectedTicket.messages?.map((msg: any, i: number) => {
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

                        {/* Admin Action Box */}
                        <form onSubmit={handleUpdateTicket} className="pt-3 border-t border-slate-100 space-y-3 shrink-0">
                            <div className="flex items-center gap-3">
                                <label className="text-xs font-bold text-slate-700 shrink-0">Update Status:</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type official staff reply to customer..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                                <button
                                    type="submit"
                                    disabled={isUpdating || (!replyText.trim() && newStatus === selectedTicket.status)}
                                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                                >
                                    {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                    <span>Send & Update</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
