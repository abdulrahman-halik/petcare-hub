'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardShell from '@/components/layout/DashboardShell';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useAuth();

    // Check role-based authenticated portals
    const isAdminPortal = pathname?.startsWith('/admin');
    const isSupplierPortal = pathname?.startsWith('/supplier');
    const isCustomerPortal =
        pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/pets') ||
        pathname?.startsWith('/orders') ||
        pathname?.startsWith('/wishlist');

    // Shared authenticated routes (profile, notifications)
    const isSharedPortal =
        pathname?.startsWith('/profile') ||
        pathname?.startsWith('/notifications');

    if (isAdminPortal) {
        return <DashboardShell role="admin">{children}</DashboardShell>;
    }

    if (isSupplierPortal) {
        return <DashboardShell role="supplier">{children}</DashboardShell>;
    }

    if (isCustomerPortal) {
        return <DashboardShell role="customer">{children}</DashboardShell>;
    }

    if (isSharedPortal) {
        const effectiveRole: 'admin' | 'supplier' | 'customer' =
            user?.role === 'admin'
                ? 'admin'
                : user?.role === 'supplier'
                ? 'supplier'
                : 'customer';
        return <DashboardShell role={effectiveRole}>{children}</DashboardShell>;
    }

    // Public / Storefront routes (e.g., /, /products, /login, /register, /cart, /checkout)
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
        </div>
    );
}
