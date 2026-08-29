'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
    Search,
    ShoppingBag,
    Heart,
    User as UserIcon,
    Menu,
    X,
    Shield,
    Package,
    Store,
    LogOut,
    ChevronDown,
    Sparkles,
    SlidersHorizontal,
    CalendarCheck
} from 'lucide-react';
import axios from '@/lib/axiosConfig';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const pathname = usePathname();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/categories');
                setCategories(data.data.categories || []);
            } catch (err) {
                console.error('Failed to load categories for nav:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
            setIsMenuOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
            {/* Top Notification Bar */}
            <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white text-xs py-1.5 px-4 text-center font-medium">
                <span>🐾 Free 2-Day Shipping on orders over $49! • 100% Vet-Approved Pet Essentials</span>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                            <span className="text-xl">🐾</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-linear-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent">
                                PetCare<span className="text-emerald-500 font-black">Hub</span>
                            </span>
                            <span className="text-[10px] text-gray-500 -mt-1 font-medium tracking-wider uppercase">
                                Premium Pet Store
                            </span>
                        </div>
                    </Link>

                    {/* Quick Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search high-protein food, cat trees, toys, medicine..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-50 hover:bg-gray-100/80 focus:bg-white text-gray-900 placeholder-gray-400 text-sm rounded-full pl-10 pr-24 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
                            />
                            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
                            <button
                                type="submit"
                                className="absolute right-1.5 top-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors shadow-xs"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
                        <Link
                            href="/"
                            className={`hover:text-emerald-600 transition-colors ${pathname === '/' ? 'text-emerald-600 font-semibold' : ''}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className={`hover:text-emerald-600 transition-colors flex items-center gap-1 ${pathname?.startsWith('/products') ? 'text-emerald-600 font-semibold' : ''}`}
                        >
                            <ShoppingBag className="w-4 h-4 text-emerald-600" />
                            Shop Catalog
                        </Link>

                        {/* Customer Pets Dashboard Link */}
                        {user && (
                            <Link
                                href="/pets"
                                className={`hover:text-emerald-600 transition-colors flex items-center gap-1.5 ${
                                    pathname === '/pets'
                                        ? 'text-emerald-600 font-bold'
                                        : 'text-gray-700'
                                }`}
                            >
                                <span className="text-base">🐾</span>
                                <span>My Pets & Care</span>
                            </Link>
                        )}

                        {/* Categories Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                                onBlur={() => setTimeout(() => setIsCatDropdownOpen(false), 200)}
                                className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                            >
                                Categories
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            </button>

                            {isCatDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Explore Collections
                                    </div>
                                    <Link
                                        href="/products"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                                    >
                                        ✨ All Categories
                                    </Link>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat._id}
                                            href={`/products?category=${cat.slug || cat._id}`}
                                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                                        >
                                            <span>{cat.name}</span>
                                            {cat.productCount !== undefined && (
                                                <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                                                    {cat.productCount}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Right User Actions */}
                    <div className="flex items-center gap-3">
                        {/* Wishlist & Cart icons — authenticated customers */}
                        {user && user.role === 'customer' && (
                            <div className="flex items-center gap-1">
                                <Link href="/wishlist" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors" title="Wishlist">
                                    <Heart className="w-5 h-5 text-gray-600" />
                                </Link>
                                <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors" title="Cart">
                                    <ShoppingBag className="w-5 h-5 text-gray-600" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                            {cartCount > 9 ? '9+' : cartCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        )}

                        {/* Supplier / Admin portal quick badges */}
                        {user?.role === 'supplier' && (
                            <Link
                                href="/supplier/products"
                                className="hidden sm:inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Store className="w-3.5 h-3.5 text-amber-600" />
                                Supplier Portal
                            </Link>
                        )}

                        {user?.role === 'admin' && (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link
                                    href="/admin/products"
                                    className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                                >
                                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                                    Products
                                </Link>
                                <Link
                                    href="/admin/categories"
                                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                                >
                                    <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                                    Categories
                                </Link>
                            </div>
                        )}

                        {/* User Menu */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    onBlur={() => setTimeout(() => setIsUserDropdownOpen(false), 200)}
                                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 mr-1 hidden sm:block" />
                                </button>

                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-xs text-gray-500">Signed in as</p>
                                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                {user.role}
                                            </span>
                                        </div>

                                        <Link
                                            href="/pets"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-700 font-bold hover:bg-emerald-50"
                                        >
                                            <span className="text-base">🐾</span>
                                            My Pets & Care Hub
                                        </Link>

                                        <Link
                                            href="/orders"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Package className="w-4 h-4 text-gray-400" />
                                            My Orders
                                        </Link>

                                        <Link
                                            href="/wishlist"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Heart className="w-4 h-4 text-rose-400" />
                                            My Wishlist
                                        </Link>

                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <UserIcon className="w-4 h-4 text-gray-400" />
                                            Account Settings
                                        </Link>

                                        {user.role === 'supplier' && (
                                            <Link
                                                href="/supplier/products"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50"
                                            >
                                                <Store className="w-4 h-4 text-amber-500" />
                                                Manage Inventory
                                            </Link>
                                        )}

                                        {user.role === 'admin' && (
                                            <>
                                                <Link
                                                    href="/admin/products"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                                                >
                                                    <Shield className="w-4 h-4 text-purple-500" />
                                                    Moderate Products
                                                </Link>
                                                <Link
                                                    href="/admin/categories"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                                                >
                                                    <SlidersHorizontal className="w-4 h-4 text-blue-500" />
                                                    Manage Categories
                                                </Link>
                                            </>
                                        )}

                                        <div className="border-t border-gray-100 my-1"></div>

                                        <button
                                            onClick={logout}
                                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="w-4 h-4 text-red-500" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="text-sm font-semibold text-gray-700 hover:text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm shadow-emerald-600/20 hover:shadow-md"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search & Menu Navigation */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t border-gray-100 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-50 text-gray-900 text-sm rounded-lg pl-10 pr-20 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <button
                                type="submit"
                                className="absolute right-1 top-1 bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md"
                            >
                                Go
                            </button>
                        </form>

                        <div className="flex flex-col space-y-2">
                            <Link
                                href="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                                Home
                            </Link>
                            <Link
                                href="/products"
                                onClick={() => setIsMenuOpen(false)}
                                className="px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                                Shop All Products
                            </Link>

                            {user && (
                                <Link
                                    href="/pets"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-3 py-2 rounded-lg text-base font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-2"
                                >
                                    <span>🐾 My Pets & Care Hub</span>
                                </Link>
                            )}

                            {user?.role === 'supplier' && (
                                <Link
                                    href="/supplier/products"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-3 py-2 rounded-lg text-base font-medium text-amber-700 bg-amber-50"
                                >
                                    Supplier Inventory
                                </Link>
                            )}

                            {user?.role === 'admin' && (
                                <>
                                    <Link
                                        href="/admin/products"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="px-3 py-2 rounded-lg text-base font-medium text-purple-700 bg-purple-50"
                                    >
                                        Moderate Products (Admin)
                                    </Link>
                                    <Link
                                        href="/admin/categories"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="px-3 py-2 rounded-lg text-base font-medium text-blue-700 bg-blue-50"
                                    >
                                        Manage Categories (Admin)
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
