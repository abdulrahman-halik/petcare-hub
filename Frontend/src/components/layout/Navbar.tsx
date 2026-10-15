'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
    Menu,
    X,
    ShoppingCart
} from 'lucide-react';
import NavbarMobileDrawer from './NavbarMobileDrawer';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartCount, openCart } = useCart();
    const pathname = usePathname();
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isLoginPage = pathname === '/login';
    const isRegisterPage = pathname === '/register';
    const isAuthPage = isLoginPage || isRegisterPage;

    const handleSignOut = async () => {
        await logout();
        setIsMenuOpen(false);
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                        <div className="w-9 h-9 rounded-xl bg-[#047857] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                            <span className="text-lg">🐾</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-[19px] tracking-tight text-[#0f172a]">
                                PetCare<span className="text-[#047857] font-black">Hub</span>
                            </span>
                            <span className="text-[9.5px] text-[#64748b] -mt-1 font-semibold tracking-[0.12em] uppercase">
                                Premium Pet Store
                            </span>
                        </div>
                    </Link>

                    {/* Dedicated Minimal Auth Page Header */}
                    {isLoginPage && (
                        <div className="flex items-center gap-2 sm:gap-3 text-[13px]">
                            <Link
                                href="/contact"
                                className="font-normal text-[#475569] hover:text-[#0f172a] transition-colors"
                            >
                                Need Help?
                            </Link>
                            <span className="text-[#cbd5e1] hidden sm:inline select-none">|</span>
                            <span className="text-[#475569] hidden md:inline">
                                New to PetCareHub?
                            </span>
                            <Link
                                href="/register"
                                className="font-semibold text-white bg-[#047857] hover:bg-[#065f46] active:bg-[#064e3b] px-3.5 sm:px-4 py-1.5 rounded-lg transition-all shadow-xs"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {isRegisterPage && (
                        <div className="flex items-center gap-2 sm:gap-3 text-[13px]">
                            <span className="text-[#475569] hidden sm:inline">
                                Already a member?
                            </span>
                            <Link
                                href="/login"
                                className="font-semibold text-white bg-[#047857] hover:bg-[#065f46] active:bg-[#064e3b] px-4 py-1.5 rounded-lg transition-all shadow-xs"
                            >
                                Log In
                            </Link>
                        </div>
                    )}

                    {/* Standard Navigation for All Other App Pages */}
                    {!isAuthPage && (
                        <>
                            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
                                <Link
                                    href="/"
                                    className={`hover:text-[#047857] transition-colors ${pathname === '/' ? 'text-[#047857] font-bold' : ''
                                        }`}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/products"
                                    className={`hover:text-[#047857] transition-colors ${pathname?.startsWith('/products') ? 'text-[#047857] font-bold' : ''
                                        }`}
                                >
                                    Shop Catalog
                                </Link>

                                <Link
                                    href="/about"
                                    className={`hover:text-[#047857] transition-colors ${pathname?.startsWith('/about') ? 'text-[#047857] font-bold' : ''
                                        }`}
                                >
                                    About Us
                                </Link>

                                <Link
                                    href="/contact"
                                    className={`hover:text-[#047857] transition-colors ${pathname?.startsWith('/contact') ? 'text-[#047857] font-bold' : ''
                                        }`}
                                >
                                    Contact Us
                                </Link>

                            </nav>

                            <div className="flex items-center gap-3">
                                {/* Cart Trigger Button with Reactive Badge */}
                                <button
                                    type="button"
                                    onClick={openCart}
                                    className="relative p-2 rounded-xl text-slate-700 hover:text-[#047857] hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100 flex items-center justify-center group"
                                    aria-label={`Open cart with ${cartCount} items`}
                                >
                                    <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-105" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#047857] text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75 ring-2 ring-white">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </button>

                                {/* Consistent Standout Darker Action Button */}
                                {user ? (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={
                                                user.role === 'admin'
                                                    ? '/admin'
                                                    : user.role === 'supplier'
                                                    ? '/supplier'
                                                    : '/dashboard'
                                            }
                                            className="inline-flex items-center gap-1.5 font-semibold text-white bg-[#047857] hover:bg-[#065f46] active:bg-[#064e3b] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all shadow-xs"
                                        >
                                            <span>Dashboard</span>
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                                            title="Sign Out"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center justify-center font-semibold text-white bg-[#047857] hover:bg-[#065f46] active:bg-[#064e3b] px-4 py-2 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
                                    >
                                        Log In
                                    </Link>
                                )}

                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    aria-label="Toggle navigation menu"
                                >
                                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <NavbarMobileDrawer
                    isOpen={!isAuthPage && isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    user={user}
                />
            </div>
        </header>
    );
}
