'use client';

import React from 'react';
import Link from 'next/link';

interface NavbarMobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    user?: any;
}

export default function NavbarMobileDrawer({
    isOpen,
    onClose,
    user
}: NavbarMobileDrawerProps) {
    if (!isOpen) return null;

    return (
        <div className="md:hidden border-t border-slate-100 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <Link
                href="/"
                onClick={onClose}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-[#047857]"
            >
                Home
            </Link>
            <Link
                href="/products"
                onClick={onClose}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-[#047857]"
            >
                Shop Catalog
            </Link>
            <Link
                href="/about"
                onClick={onClose}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-[#047857]"
            >
                About Us
            </Link>
            <Link
                href="/contact"
                onClick={onClose}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-[#047857]"
            >
                Contact Us
            </Link>

            {/* Mobile Action Button */}
            <div className="pt-2 px-3">
                {user ? (
                    <Link
                        href={
                            user.role === 'admin'
                                ? '/admin'
                                : user.role === 'supplier'
                                ? '/supplier'
                                : '/dashboard'
                        }
                        onClick={onClose}
                        className="block text-center w-full font-semibold text-white bg-[#047857] hover:bg-[#065f46] py-2.5 rounded-xl text-sm transition-all shadow-xs"
                    >
                        Go to Dashboard
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        onClick={onClose}
                        className="block text-center w-full font-semibold text-white bg-[#047857] hover:bg-[#065f46] py-2.5 rounded-xl text-sm transition-all shadow-xs"
                    >
                        Log In
                    </Link>
                )}
            </div>
        </div>
    );
}
