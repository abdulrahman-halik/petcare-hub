'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, Search, RefreshCw } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import AdminProductTable from '@/components/admin/AdminProductTable';

export default function AdminProductsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');

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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span>Catalog Administration</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Product Moderation & Oversight
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Audit supplier submissions, ensure vet-standard compliance, and flag policy violations.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchAdminProducts}
                        className="inline-flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-xs text-xs font-semibold"
                        title="Refresh Listings"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:max-w-md">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                        type="text"
                        placeholder="Search product title, supplier name, brand..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">All Moderation Statuses</option>
                        <option value="active">Active & Approved</option>
                        <option value="flagged">Flagged Items</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <AdminProductTable
                loading={loading}
                products={filtered}
                onModerateStatus={handleModerateStatus}
                onDeleteProduct={handleDeleteProduct}
            />
        </div>
    );
}
