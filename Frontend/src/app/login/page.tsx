'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-140px)] w-full flex items-center justify-center py-12 px-4 sm:px-6 bg-gradient-to-r from-[#edf8f4] via-[#f7fafc] to-[#edf4fc] relative overflow-hidden">
            {/* Soft subtle radial ambient glow matching reference screenshot */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-emerald-200/20 blur-3xl rounded-full pointer-events-none" />

            {/* Login Card */}
            <div className="relative z-10 max-w-[430px] w-full bg-white rounded-[28px] sm:rounded-[32px] p-8 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] border border-[#f1f5f9] my-6 transition-all">
                {/* Heart Icon Badge */}
                <div className="w-12 h-12 rounded-2xl bg-[#e6f7f2] flex items-center justify-center mx-auto mb-5">
                    <Heart className="w-5 h-5 fill-[#0b8a6e] text-[#0b8a6e]" />
                </div>

                {/* Heading & Subtitle */}
                <h1 className="text-[26px] sm:text-[27px] font-extrabold text-[#111827] text-center tracking-tight leading-snug">
                    Sign in to your account
                </h1>
                <p className="mt-2 text-center text-[13px] text-[#64748b] leading-relaxed max-w-[310px] mx-auto">
                    Welcome back! Access your pet&apos;s wellness plans, orders, and personalized nutrition.
                </p>

                {/* Error Banner */}
                {error && (
                    <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-[10.5px] font-bold tracking-[0.06em] text-[#334155] uppercase mb-1.5">
                            EMAIL ADDRESS
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3.5 pointer-events-none" />
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@petlover.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] hover:bg-[#f1f5f9]/60 focus:bg-white rounded-xl border border-[#e2e8f0] focus:border-[#2563eb] focus:ring-3 focus:ring-[#2563eb]/10 text-[#1e293b] text-[13.5px] placeholder:text-[#94a3b8] transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label htmlFor="password" className="text-[10.5px] font-bold tracking-[0.06em] text-[#334155] uppercase">
                                PASSWORD
                            </label>
                            <Link
                                href="/contact"
                                className="text-[12px] font-semibold text-[#0d9488] hover:text-[#0f766e] transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative flex items-center">
                            <Lock className="w-4 h-4 text-[#94a3b8] absolute left-3.5 pointer-events-none" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-2.5 bg-[#f8fafc] hover:bg-[#f1f5f9]/60 focus:bg-white rounded-xl border border-[#e2e8f0] focus:border-[#2563eb] focus:ring-3 focus:ring-[#2563eb]/10 text-[#1e293b] text-[13.5px] placeholder:text-[#94a3b8] transition-all outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-[#94a3b8] hover:text-[#64748b] transition-colors p-1 cursor-pointer"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Keep Signed In Checkbox */}
                    <div className="flex items-center gap-2 pt-0.5">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 rounded-[4px] border-[#cbd5e1] text-[#2563eb] focus:ring-[#2563eb] cursor-pointer"
                        />
                        <label htmlFor="remember-me" className="text-[12.5px] text-[#475569] font-normal cursor-pointer select-none">
                            Keep me signed in for 30 days
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-white font-medium text-[14px] bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] shadow-xs transition-colors duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
                    >
                        {loading ? (
                            <span className="inline-flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Signing in...
                            </span>
                        ) : (
                            <>
                                <span>Sign in</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </>
                        )}
                    </button>

                    {/* Register Navigation Link */}
                    <div className="text-center text-[13px] text-[#64748b] pt-1">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="font-semibold text-[#2563eb] hover:underline">
                            Register here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
