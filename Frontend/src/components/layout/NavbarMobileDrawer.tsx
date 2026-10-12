'use client';

import React from 'react';
import Link from 'next/link';

interface NavbarMobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export default function NavbarMobileDrawer({
    isOpen,
    onClose,
    user
}: NavbarMobileDrawerProps) {
    if (!isOpen) return null;

    return (
        <div className="md:hidden border-t border-gray-100 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <Link
                href="/"
                onClick={onClose}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
                Home
            </Link>
            <Link
                href="/products"
                onClick={onClose}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
                Shop Catalog
            </Link>

            {user?.role === 'customer' && (
                <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-base font-bold text-emerald-800 bg-emerald-50"
                >
                    🐾 Open Dashboard
                </Link>
            )}
            {user?.role === 'supplier' && (
                <Link
                    href="/supplier"
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-base font-bold text-teal-800 bg-teal-50"
                >
                    🏬 Open Supplier Portal
                </Link>
            )}
            {user?.role === 'admin' && (
                <Link
                    href="/admin"
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-base font-bold text-slate-800 bg-slate-100"
                >
                    🛡️ Open Admin Console
                </Link>
            )}
        </div>
    );
}
