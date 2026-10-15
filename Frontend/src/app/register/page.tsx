'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreeTerms) {
            setError('Please agree to the Terms of Service and Privacy Policy to continue.');
            return;
        }

        setError('');
        setLoading(true);
        try {
            await register({ name, email, password, role });
        } catch (err: unknown) {
            let message = 'Registration failed. Please check your details.';
            if (err && typeof err === 'object' && 'response' in err) {
                const response = (err as { response?: { data?: { message?: string } } }).response;
                if (response?.data?.message) {
                    message = response.data.message;
                }
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-140px)] w-full flex items-center justify-center py-12 px-4 sm:px-6 bg-slate-50">
            {/* Registration Card */}
            <div className="max-w-[430px] w-full bg-white rounded-3xl p-8 sm:p-9 shadow-xs border border-slate-200/80 my-6 transition-all">
                {/* Rewards Pill Badge */}
                <div className="flex justify-center mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#047857] text-[11px] font-semibold">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#047857] text-white flex items-center justify-center text-[9px] font-black shrink-0">
                            ✓
                        </span>
                        <span>Pet Parent Rewards Included</span>
                    </div>
                </div>

                {/* Heading & Subtitle */}
                <h1 className="text-[26px] sm:text-[27px] font-extrabold text-slate-900 text-center tracking-tight leading-snug">
                    Create your account
                </h1>
                <p className="mt-2 text-center text-[13px] text-slate-500 leading-relaxed max-w-[320px] mx-auto">
                    Join thousands of pet lovers &amp; unlock personalized health care advice
                </p>

                {/* Error Banner */}
                {error && (
                    <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="name" className="block text-[11px] font-bold tracking-[0.05em] text-slate-700 uppercase mb-1.5">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Sarah Jenkins"
                            className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 text-slate-800 text-[13.5px] placeholder:text-slate-400 transition-all outline-none"
                        />
                    </div>

                    {/* Email Address */}
                    <div>
                        <label htmlFor="email" className="block text-[11px] font-bold tracking-[0.05em] text-slate-700 uppercase mb-1.5">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 text-slate-800 text-[13.5px] placeholder:text-slate-400 transition-all outline-none"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label htmlFor="password" className="text-[11px] font-bold tracking-[0.05em] text-slate-700 uppercase">
                                Password
                            </label>
                            <span className="text-[11px] text-slate-400">Min. 8 characters</span>
                        </div>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a strong password"
                            className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 text-slate-800 text-[13.5px] placeholder:text-slate-400 transition-all outline-none"
                        />
                    </div>

                    {/* Account Role Dropdown */}
                    <div>
                        <label htmlFor="role" className="block text-[11px] font-bold tracking-[0.05em] text-slate-700 uppercase mb-1.5">
                            Account Role
                        </label>
                        <div className="relative">
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3.5 py-2.5 appearance-none bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 text-slate-800 text-[13.5px] transition-all outline-none cursor-pointer pr-10"
                            >
                                <option value="customer">Customer (Pet Owner)</option>
                                <option value="supplier">Supplier (Products &amp; Services)</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Terms & Privacy Checkbox */}
                    <div className="flex items-start gap-2 pt-0.5">
                        <input
                            id="agree-terms"
                            type="checkbox"
                            required
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="h-4 w-4 mt-0.5 rounded border-slate-300 text-[#047857] focus:ring-[#047857] cursor-pointer accent-[#047857]"
                        />
                        <label htmlFor="agree-terms" className="text-[12px] text-slate-600 cursor-pointer select-none leading-normal">
                            I agree to the{' '}
                            <Link href="/privacy" className="font-semibold text-[#047857] hover:text-[#065f46] hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="font-semibold text-[#047857] hover:text-[#065f46] hover:underline">
                                Privacy Policy
                            </Link>
                            .
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-white font-semibold text-[14px] bg-[#047857] hover:bg-[#065f46] active:bg-[#064e3b] shadow-xs transition-colors duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
                    >
                        {loading ? (
                            <span className="inline-flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating account...
                            </span>
                        ) : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </>
                        )}
                    </button>

                    {/* Login Navigation Link */}
                    <div className="text-center text-[13px] text-slate-500 pt-1">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-[#047857] hover:text-[#065f46] hover:underline">
                            Sign in here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
