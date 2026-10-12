'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LogOut, ChevronDown } from 'lucide-react';

interface NavbarUserMenuProps {
    user: any;
    onSignOut: () => void;
}

export default function NavbarUserMenu({
    user,
    onSignOut,
}: NavbarUserMenuProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Link
                    href="/login"
                    className="text-sm font-semibold text-gray-700 hover:text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Log In
                </Link>

                <Link
                    href="/register"
                    className="text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-all shadow-xs hover:shadow-md"
                >
                    Get Started
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                    </div>

                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 mr-1 hidden sm:block" />
                </button>

                {isDropdownOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsDropdownOpen(false)}
                        />

                        <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="px-4 py-2.5 border-b border-gray-100">
                                <p className="text-xs text-gray-500">
                                    Signed in as
                                </p>

                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user.name}
                                </p>

                                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    {user.role}
                                </span>
                            </div>

                            <div className="border-t border-gray-100 my-1" />

                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    onSignOut();
                                }}
                                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4 text-rose-500" />

                                <span>Sign Out</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}