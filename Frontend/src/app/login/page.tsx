'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getRoleDashboardPath } from '@/lib/roleNavigation';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

function LoginForm() {
    const { user, login, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRegistered = searchParams?.get('registered') === 'true';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Auto-redirect already authenticated users to their respective dashboard
    useEffect(() => {
        if (!authLoading && user) {
            router.replace(getRoleDashboardPath(user.role));
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password });
        } catch (err: unknown) {
            let message = 'Invalid email or password. Please try again.';
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
            {/* Login Card */}
            <div className="max-w-[430px] w-full bg-white rounded-3xl p-8 sm:p-9 shadow-xs border border-slate-200/80 my-6 transition-all">
                {/* Heart Icon Badge */}
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5">
                    <Heart className="w-5 h-5 fill-[#047857] text-[#047857]" />
                </div>

                {/* Heading & Subtitle */}
                <h1 className="text-[26px] sm:text-[27px] font-extrabold text-slate-900 text-center tracking-tight leading-snug">
                    Sign in to your account
                </h1>
                <p className="mt-2 text-center text-[13px] text-slate-500 leading-relaxed max-w-[310px] mx-auto">
                    Welcome back! Access your pet&apos;s wellness plans, orders, and personalized nutrition.
                </p>

                {/* Success Banner after registration */}
                {isRegistered && !error && (
                    <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>Registration successful! Please sign in with your credentials.</span>
                    </div>
                )}

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
                        <label htmlFor="email" className="block text-[10.5px] font-bold tracking-[0.06em] text-slate-700 uppercase mb-1.5">
                            EMAIL ADDRESS
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@petlover.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 text-slate-800 text-[13.5px] placeholder:text-slate-400 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label htmlFor="password" className="text-[10.5px] font-bold tracking-[0.06em] text-slate-700 uppercase">
                                PASSWORD
                            </label>
                            <Link
                                href="/contact"
                                className="text-[12px] font-semibold text-[#047857] hover:text-[#065f46] transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative flex items-center">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 text-slate-800 text-[13.5px] placeholder:text-slate-400 transition-all outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
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
                            className="h-4 w-4 rounded border-slate-300 text-[#047857] focus:ring-[#047857] cursor-pointer accent-[#047857]"
                        />
                        <label htmlFor="remember-me" className="text-[12.5px] text-slate-600 font-normal cursor-pointer select-none">
                            Keep me signed in for 30 days
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
                    <div className="text-center text-[13px] text-slate-500 pt-1">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="font-semibold text-[#047857] hover:text-[#065f46] hover:underline">
                            Register here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-[calc(100vh-140px)] w-full flex items-center justify-center text-slate-500 text-sm">Loading sign-in...</div>}>
            <LoginForm />
        </Suspense>
    );
}
