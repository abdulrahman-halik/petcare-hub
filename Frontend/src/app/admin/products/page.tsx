'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    Shield,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Search,
    Trash2,
    ExternalLink,
    Filter,
    Store,
    RefreshCw,
    SlidersHorizontal
} from 'lucide-react';
import axios from '@/lib/axiosConfig';
import Link from 'next/link';

export default function AdminProductsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Admin Auth Guard
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                router.push('/');
            }
        }
    }, [user, authLoading, router]);

    const fetchAdminProducts = async () => {
        try {
            setLoading(true);
            const params: any = { limit: 100 };
            if (selectedStatus !== 'all') params.status = selectedStatus;
            if (selectedCategory !== 'all') params.category = selectedCategory;

            const [prodRes, catRes] = await Promise.all([
                axios.get('/products', { params }),
                axios.get('/categories')
            ]);
            setProducts(prodRes.data.data.products || []);
            setCategories(catRes.data.data.categories || []);
        } catch (err: any) {
            console.error('Error fetching admin products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchAdminProducts();
        }
    }, [user, selectedStatus, selectedCategory]);

    // Moderate product status
    const handleModerateStatus = async (id: string, newStatus: 'active' | 'flagged' | 'inactive') => {
        try {
            await axios.patch(`/products/${id}/moderate`, { status: newStatus });
            setProducts(prev =>
                prev.map(p => (p._id === id ? { ...p, status: newStatus } : p))
            );
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update moderation status');
        }
    };

    // Admin Delete product
    const handleDeleteProduct = async (id: string, name: string) => {
        if (confirm(`Admin Action: Permanently delete product "${name}"?`)) {
            try {
                await axios.delete(`/products/${id}`);
                setProducts(prev => prev.filter(p => p._id !== id));
            } catch (err: any) {
                alert(err.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.supplier?.name && p.supplier.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
                            <Shield className="w-4 h-4" />
                            <span>Admin Center</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Product Moderation & Oversight
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/categories"
                            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm px-4 py-2.5 rounded-xl border border-gray-200 shadow-xs transition-colors"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                            Category Management
                        </Link>
                        <button
                            onClick={fetchAdminProducts}
                            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-xs"
                            title="Refresh Listings"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:max-w-md">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            placeholder="Search by product title, supplier name, brand..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700"
                        >
                            <option value="all">All Moderation Statuses</option>
                            <option value="active">Active Only</option>
                            <option value="flagged">Flagged Items</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* MODERATION TABLE */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Supplier</th>
                                    <th className="px-6 py-4">Price & Stock</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Moderation Action</th>
                                    <th className="px-6 py-4 text-right">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                            Loading products across all suppliers...
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No products found matching your moderation criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((p) => {
                                        const imgUrl = p.imageUrl || (p.images && p.images[0]) || '';
                                        return (
                                            <tr key={p._id} className="hover:bg-gray-50/70 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={imgUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80'}
                                                            alt=""
                                                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                                                        />
                                                        <div>
                                                            <p className="font-bold text-gray-900 line-clamp-1 max-w-xs">{p.name}</p>
                                                            <p className="text-xs text-gray-400">{p.category?.name || 'General'}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-gray-900 text-xs">{p.supplier?.name || 'Unknown Supplier'}</p>
                                                    <p className="text-[11px] text-gray-400">{p.supplier?.email || ''}</p>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-900">${Number(p.price).toFixed(2)}</p>
                                                    <p className="text-xs text-gray-500">{p.stock} units</p>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                                                        p.status === 'active'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : p.status === 'flagged'
                                                            ? 'bg-rose-100 text-rose-800'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {p.status}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => handleModerateStatus(p._id, 'active')}
                                                            disabled={p.status === 'active'}
                                                            className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleModerateStatus(p._id, 'flagged')}
                                                            disabled={p.status === 'flagged'}
                                                            className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-40"
                                                        >
                                                            Flag
                                                        </button>
                                                        <button
                                                            onClick={() => handleModerateStatus(p._id, 'inactive')}
                                                            disabled={p.status === 'inactive'}
                                                            className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40"
                                                        >
                                                            Disable
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <a
                                                            href={`/products/${p._id}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeleteProduct(p._id, p.name)}
                                                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                                                            title="Admin Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
