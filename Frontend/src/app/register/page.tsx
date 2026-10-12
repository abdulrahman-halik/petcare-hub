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
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-140px)] w-full flex items-center justify-center py-12 px-4 sm:px-6 bg-gradient-to-r from-[#edf8f4] via-[#f7fafc] to-[#edf4fc] relative overflow-hidden">
            {/* Soft subtle radial ambient glow matching reference screenshot */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-emerald-200/20 blur-3xl rounded-full pointer-events-none" />

            {/* Registration Card */}
            <div className="relative z-10 max-w-[430px] w-full bg-white rounded-[28px] sm:rounded-[32px] p-8 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] border border-[#f1f5f9] my-6 transition-all">
                {/* Rewards Pill Badge */}
                <div className="flex justify-center mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f7f2] border border-[#a7f3d0]/60 text-[#047857] text-[11px] font-semibold">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#059669] text-white flex items-center justify-center text-[9px] font-black shrink-0">
                            ✓
                        </span>
                        <span>Pet Parent Rewards Included</span>
                    </div>
                </div>

                {/* Heading & Subtitle */}
                <h1 className="text-[26px] sm:text-[27px] font-extrabold text-[#111827] text-center tracking-tight leading-snug">
                    Create your account
                </h1>
                <p className="mt-2 text-center text-[13px] text-[#64748b] leading-relaxed max-w-[320px] mx-auto">
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
                        <label htmlFor="name" className="block text-[12px] font-medium text-[#334155] mb-1.5">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Sarah Jenkins"
                            className="w-full px-3.5 py-2.5 bg-[#f8fafc] hover:bg-[#f1f5f9]/60 focus:bg-white rounded-xl border border-[#e2e8f0] focus:border-[#0d9488] focus:ring-3 focus:ring-[#0d9488]/10 text-[#1e293b] text-[13.5px] placeholder:text-[#94a3b8] transition-all outline-none"
                        />
                    </div>

                    {/* Email Address */}
                    <div>
                        <label htmlFor="email" className="block text-[12px] font-medium text-[#334155] mb-1.5">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full px-3.5 py-2.5 bg-[#f8fafc] hover:bg-[#f1f5f9]/60 focus:bg-white rounded-xl border border-[#e2e8f0] focus:border-[#0d9488] focus:ring-3 focus:ring-[#0d9488]/10 text-[#1e293b] text-[13.5px] placeholder:text-[#94a3b8] transition-all outline-none"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label htmlFor="password" className="text-[12px] font-medium text-[#334155]">
                                Password
                            </label>
                            <span className="text-[11px] text-[#94a3b8]">Min. 8 characters</span>
                        </div>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a strong password"
                            className="w-full px-3.5 py-2.5 bg-[#f8fafc] hover:bg-[#f1f5f9]/60 focus:bg-white rounded-xl border border-[#e2e8f0] focus:border-[#0d9488] focus:ring-3 focus:ring-[#0d9488]/10 text-[#1e293b] text-[13.5px] placeholder:text-[#94a3b8] transition-all outline-none"
                        />
                    </div>

                    {/* Account Role Dropdown */}
                    <div>
                        <label htmlFor="role" className="block text-[12px] font-medium text-[#334155] mb-1.5">
                            Account Role
                        </label>
                        <div className="relative">
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3.5 py-2.5 appearance-none bg-[#f8fafc] hover:bg-[#f1f5f9]/60 focus:bg-white rounded-xl border border-[#e2e8f0] focus:border-[#0d9488] focus:ring-3 focus:ring-[#0d9488]/10 text-[#1e293b] text-[13.5px] transition-all outline-none cursor-pointer pr-10"
                            >
                                <option value="customer">Customer (Pet Owner)</option>
                                <option value="supplier">Supplier (Products &amp; Services)</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                            className="h-4 w-4 mt-0.5 rounded-[4px] border-[#cbd5e1] text-[#0d9488] focus:ring-[#0d9488] cursor-pointer"
                        />
                        <label htmlFor="agree-terms" className="text-[12px] text-[#475569] cursor-pointer select-none leading-normal">
                            I agree to the{' '}
                            <Link href="/privacy" className="font-semibold text-[#0d9488] hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="font-semibold text-[#0d9488] hover:underline">
                                Privacy Policy
                            </Link>
                            .
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-white font-medium text-[14px] bg-[#0d9488] hover:bg-[#0f766e] active:bg-[#115e59] shadow-xs transition-colors duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
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
                    <div className="text-center text-[13px] text-[#64748b] pt-1">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-[#0d9488] hover:underline">
                            Sign in here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
