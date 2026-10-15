'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Package, SlidersHorizontal, PawPrint, Headphones, Store, Users } from 'lucide-react';
import DashboardSidebar, { NavItem } from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

interface DashboardShellProps {
    children: React.ReactNode;
    role: 'admin' | 'supplier' | 'customer';
}

const ROLE_CONFIG = {
    admin: {
        title: 'Admin Dashboard',
        badge: 'Administrator',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        navItems: [
            { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
            { label: 'Supplier Management', href: '/admin/suppliers', icon: Store },
            { label: 'Customer Management', href: '/admin/customers', icon: Users },
            { label: 'Product Moderation', href: '/admin/products', icon: Package },
            { label: 'Categories', href: '/admin/categories', icon: SlidersHorizontal },
            { label: 'Support Desk', href: '/admin/support', icon: Headphones }
        ] as NavItem[]
    },
    supplier: {
        title: 'Supplier Dashboard',
        badge: 'Verified Supplier',
        badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
        navItems: [
            { label: 'Overview', href: '/supplier', icon: LayoutDashboard, exact: true },
            { label: 'Product Inventory', href: '/supplier/products', icon: Package }
        ] as NavItem[]
    },
    customer: {
        title: 'Customer Dashboard',
        badge: 'Pet Parent',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        navItems: [
            { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
            { label: 'My Pets & Health', href: '/pets', icon: PawPrint },
            { label: 'My Orders', href: '/orders', icon: Package },
            { label: 'Help & Support', href: '/support', icon: Headphones }
        ] as NavItem[]
    }
};

export default function DashboardShell({ children, role }: DashboardShellProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const currentConfig = ROLE_CONFIG[role] || ROLE_CONFIG.customer;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row antialiased text-gray-900">
            <DashboardSidebar
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                isMobileOpen={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
                title={currentConfig.title}
                badge={currentConfig.badge}
                badgeColor={currentConfig.badgeColor}
                navItems={currentConfig.navItems}
            />

            <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300
                    ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}
                `}
            >
                <DashboardHeader
                    role={role}
                    title={currentConfig.title}
                    navItems={currentConfig.navItems}
                    onOpenMobile={() => setIsMobileOpen(true)}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
