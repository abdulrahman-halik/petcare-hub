'use client';

import React, { useState } from 'react';
import axios from '@/lib/axiosConfig';
import { isAxiosError } from 'axios';

export interface ProfileUser {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface ProfileFormProps {
    user: ProfileUser;
    onUpdated: (user: ProfileUser) => void;
    onSignOut: () => void;
}

export default function ProfileForm({ user, onUpdated, onSignOut }: ProfileFormProps) {
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError('');
            setSuccess('');
            setSaving(true);
            const { data } = await axios.put('/users/profile', { name, email, password });
            onUpdated(data.data.user);
            setSuccess('Profile updated successfully');
            setPassword('');
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const errorData = err.response?.data as { message?: string } | undefined;
                setError(errorData?.message || err.message);
            } else {
                setError('Failed to update profile');
            }
        } finally {
            setSaving(false);
        }
    };

    const roleBadgeStyles: Record<string, string> = {
        admin: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        supplier: 'bg-teal-100 text-teal-800 border-teal-300',
        customer: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };

    return (
        <div className="bg-white shadow-sm border border-gray-100 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Account Settings</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Manage your personal credentials, contact info, and security</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${roleBadgeStyles[user.role] || roleBadgeStyles.customer}`}>
                        Role: {user.role}
                    </span>
                    <button
                        onClick={onSignOut}
                        type="button"
                        className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
                {error && (
                    <div className="text-red-700 text-xs bg-red-50 p-3.5 rounded-xl border border-red-200 font-semibold">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="text-emerald-800 text-xs bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 font-semibold">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none block w-full transition-colors"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none block w-full transition-colors"
                        />
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            New Password <span className="text-gray-400 font-normal lowercase">(leave blank to keep current)</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password to change..."
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none block w-full transition-colors"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex justify-center items-center py-2.5 px-6 border border-transparent shadow-md text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
                    >
                        {saving ? 'Updating...' : 'Update Profile & Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}
