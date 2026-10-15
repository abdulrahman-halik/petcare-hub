'use client';

import React from 'react';
import { X, Send, RefreshCw } from 'lucide-react';
import { getStatusBadge, SupportTicket, TicketMessage } from './SupportTicketList';

interface SupportTicketChatProps {
    activeTicket: SupportTicket | null;
    onClose: () => void;
    replyText: string;
    onReplyTextChange: (v: string) => void;
    onSendReply: (e: React.FormEvent) => void;
    isReplying: boolean;
}

export default function SupportTicketChat({
    activeTicket,
    onClose,
    replyText,
    onReplyTextChange,
    onSendReply,
    isReplying
}: SupportTicketChatProps) {
    if (!activeTicket) return null;

    return (
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
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
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
                    <form onSubmit={onSendReply} className="pt-3 border-t border-slate-100 flex gap-2 shrink-0">
                        <input
                            type="text"
                            required
                            placeholder="Type your follow-up reply..."
                            value={replyText}
                            onChange={(e) => onReplyTextChange(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                            type="submit"
                            disabled={isReplying || !replyText.trim()}
                            className="bg-[#047857] hover:bg-[#065f46] active:bg-[#064e3b] disabled:bg-slate-300 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                            {isReplying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            <span>Send</span>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
