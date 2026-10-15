'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Plus, Search, Store } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import SupplierStatsGrid from '@/components/supplier/SupplierStatsGrid';
import SupplierProductTable from '@/components/supplier/SupplierProductTable';
import SupplierProductModal from '@/components/supplier/SupplierProductModal';

export default function SupplierProductsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'supplier' && user.role !== 'admin') {
                router.push('/profile');
            }
        }
    }, [user, authLoading, router]);

    const loadSupplierData = async () => {
        try {
            setLoading(true);
            const [prodRes, catRes] = await Promise.all([
                axios.get('/products/supplier/my-products'),
                axios.get('/categories')
            ]);
            setProducts(prodRes.data.data.products || []);
            setStats(prodRes.data.data.stats || {});
            setCategories(catRes.data.data.categories || []);
        } catch (err: any) {
            console.error('Error fetching supplier data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && (user.role === 'supplier' || user.role === 'admin')) {
            loadSupplierData();
        }
    }, [user]);

    const handleOpenAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (prod: any) => {
        setEditingProduct(prod);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
        try {
            await axios.delete(`/products/${id}`);
            loadSupplierData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete product');
        }
    };

    const filteredProducts = products.filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            p.name?.toLowerCase().includes(q) ||
            p.category?.name?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
                        <Store className="w-4 h-4 text-teal-600" />
                        <span>Supplier Inventory</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Product Catalog Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Add, edit, manage stock, and maintain your store listings.
                    </p>
                </div>

                <button
                    onClick={handleOpenAdd}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span>List New Product</span>
                </button>
            </div>

            <SupplierStatsGrid stats={stats} loading={loading} />

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by product name, brand..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 hover:bg-white focus:bg-white rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                        />
                    </div>
                </div>

                <SupplierProductTable
                    products={filteredProducts}
                    loading={loading}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteProduct}
                />
            </div>

            <SupplierProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSaved={loadSupplierData}
                editingProduct={editingProduct}
                categories={categories}
            />
        </div>
    );
}
