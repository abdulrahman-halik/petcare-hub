'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, CalendarCheck, ChevronRight, User, Shield, Store } from 'lucide-react';
import axios from '@/lib/axiosConfig';

export default function ProfilePage() {
    const { user, setUser, logout, loading } = useAuth();
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [petsCount, setPetsCount] = useState(0);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            setName(user.name);
            setEmail(user.email);

            // Fetch pet count
            axios.get('/pets')
                .then(res => setPetsCount(res.data.data.pets?.length || 0))
                .catch(() => setPetsCount(0));
        }
    }, [user, loading, router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError('');
            setSuccess('');
            const { data } = await axios.put('/users/profile', { name, email, password });
            setUser(data.data.user);
            setSuccess('Profile updated successfully');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-3xl animate-bounce">🐾</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Pet Care Hub Quick Card */}
                <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                            <span>My Pet Care Hub</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black">
                            {petsCount > 0 ? `${petsCount} Registered Pets` : 'Manage Your Pets & Health Schedules'}
                        </h3>
                        <p className="text-xs sm:text-sm text-emerald-100/80 max-w-md">
                            Access automated vaccination schedules, vet health reminders, and AI smart product recommendations.
                        </p>
                    </div>

                    <Link
                        href="/pets"
                        className="bg-white text-emerald-900 hover:bg-emerald-50 text-xs sm:text-sm font-extrabold px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-1.5 shrink-0"
                    >
                        <span>Open Pet Care Hub</span>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Profile Edit Card */}
                <div className="bg-white shadow-sm border border-gray-100 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900">Account Settings</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Manage your personal credentials and role details</p>
                        </div>
                        <button
                            onClick={logout}
                            className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                            Role: {user.role}
                        </span>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        {error && <div className="text-red-600 text-xs bg-red-50 p-3 rounded-xl border border-red-200 font-semibold">{error}</div>}
                        {success && <div className="text-emerald-700 text-xs bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-semibold">{success}</div>}

                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none block w-full"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none block w-full"
                                />
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    New Password (leave blank to keep current)
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none block w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-md text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
                            >
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
