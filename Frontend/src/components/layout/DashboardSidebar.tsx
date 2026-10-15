'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    exact?: boolean;
}

interface DashboardSidebarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    isMobileOpen: boolean;
    onCloseMobile: () => void;
    title: string;
    badge: string;
    badgeColor: string;
    navItems: NavItem[];
}

export default function DashboardSidebar({
    isCollapsed,
    onToggleCollapse,
    isMobileOpen,
    onCloseMobile,
    title,
    badge,
    badgeColor,
    navItems
}: DashboardSidebarProps) {
    const pathname = usePathname();

    const isLinkActive = (item: NavItem) => {
        if (item.exact) {
            return pathname === item.href;
        }
        return pathname?.startsWith(item.href);
    };

    return (
        <>
            {/* Mobile Drawer Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
                    onClick={onCloseMobile}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-gray-200/90 flex flex-col transition-all duration-300 ease-in-out shadow-xs
                    ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
                    ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
                `}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 shrink-0">
                    <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
                        <div className="w-10 h-10 rounded-xl bg-[#047857] flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                            <span className="text-xl">🐾</span>
                        </div>
                        {(!isCollapsed || isMobileOpen) && (
                            <div className="flex flex-col min-w-0">
                                <span className="font-extrabold text-base tracking-tight text-slate-900 truncate">
                                    PetCare<span className="text-[#047857] font-black">Hub</span>
                                </span>
                                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider truncate">
                                    {title}
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={onToggleCollapse}
                        className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={onCloseMobile}
                        className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Role Badge Indicator */}
                {(!isCollapsed || isMobileOpen) && (
                    <div className="px-4 pt-3 pb-1">
                        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center justify-between ${badgeColor}`}>
                            <span>{badge}</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isLinkActive(item);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onCloseMobile}
                                title={isCollapsed && !isMobileOpen ? item.label : undefined}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group
                                    ${active
                                        ? 'bg-emerald-50 text-emerald-800 font-bold shadow-xs border border-emerald-200/80'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                                    }
                                    ${isCollapsed && !isMobileOpen ? 'justify-center px-2' : ''}
                                `}
                            >
                                <Icon
                                    className={`w-5 h-5 shrink-0 transition-colors
                                        ${active ? 'text-emerald-700' : 'text-gray-400 group-hover:text-gray-700'}
                                    `}
                                />
                                {(!isCollapsed || isMobileOpen) && (
                                    <span className="truncate">{item.label}</span>
                                )}
                                {item.badge && (!isCollapsed || isMobileOpen) && (
                                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
