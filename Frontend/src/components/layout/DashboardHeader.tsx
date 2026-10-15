'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    Heart,
    Bell,
    LogOut,
    ChevronDown,
    Menu,
    User
} from 'lucide-react';
import { NavItem } from './DashboardSidebar';

interface DashboardHeaderProps {
    role: 'admin' | 'supplier' | 'customer';
    title: string;
    navItems: NavItem[];
    onOpenMobile: () => void;
}

export default function DashboardHeader({
    role,
    title,
    navItems,
    onOpenMobile
}: DashboardHeaderProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const handleSignOut = async () => {
        setIsProfileDropdownOpen(false);
        await logout();
    };

    const currentNavLabel =
        pathname === '/profile'
            ? 'Profile & Settings'
            : navItems.find((i) => (i.exact ? pathname === i.href : pathname?.startsWith(i.href)))?.label || 'Console';

    return (
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    onClick={onOpenMobile}
                    className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    aria-label="Open sidebar menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 text-sm truncate">
                    <span className="font-semibold text-gray-500 hidden sm:inline">
                        {title}
                    </span>
                    <span className="text-gray-300 hidden sm:inline">/</span>
                    <span className="font-bold text-gray-900 truncate">
                        {currentNavLabel}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
                {role === 'customer' && (
                    <Link
                        href="/wishlist"
                        className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        title="Wishlist"
                    >
                        <Heart className="w-5 h-5" />
                    </Link>
                )}

                <Link
                    href="/notifications"
                    className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative"
                    title="Notifications"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"></span>
                </Link>

                {user ? (
                    <div className="relative pl-2 border-l border-gray-200">
                        <button
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none"
                            aria-expanded={isProfileDropdownOpen}
                            aria-haspopup="true"
                            title="Profile & Settings"
                        >
                            <div className="hidden sm:block text-right">
                                <p className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[120px]">
                                    {user.name || 'Account'}
                                </p>
                                <span className="text-[10px] font-semibold text-emerald-700 capitalize">
                                    {user.role || role}
                                </span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200 ring-2 ring-emerald-500/20">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform hidden sm:block ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isProfileDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsProfileDropdownOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                        <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                            {user.role}
                                        </span>
                                    </div>

                                    <div className="py-1">
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                                        >
                                            <User className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <div className="flex flex-col text-left">
                                                <span>Profile & Settings</span>
                                                <span className="text-[10px] text-gray-400 font-normal">Change name, email & password</span>
                                            </div>
                                        </Link>
                                    </div>

                                    <div className="border-t border-gray-100 my-1"></div>

                                    <button
                                        onClick={() => {
                                            setIsProfileDropdownOpen(false);
                                            handleSignOut();
                                        }}
                                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4 shrink-0" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </header>
    );
}
