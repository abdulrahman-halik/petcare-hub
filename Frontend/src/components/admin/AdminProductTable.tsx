'use client';

import React from 'react';
import { ExternalLink, Trash2 } from 'lucide-react';

interface AdminProductTableProps {
    loading: boolean;
    products: any[];
    onModerateStatus: (id: string, status: 'active' | 'flagged' | 'inactive') => void;
    onDeleteProduct: (id: string, name: string) => void;
}

export default function AdminProductTable({
    loading,
    products,
    onModerateStatus,
    onDeleteProduct
}: AdminProductTableProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200/80">
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
                                    Loading listings across suppliers...
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No products found matching your moderation criteria.
                                </td>
                            </tr>
                        ) : (
                            products.map((p) => {
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
                                                    onClick={() => onModerateStatus(p._id, 'active')}
                                                    disabled={p.status === 'active'}
                                                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => onModerateStatus(p._id, 'flagged')}
                                                    disabled={p.status === 'flagged'}
                                                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-40 transition-colors"
                                                >
                                                    Flag
                                                </button>
                                                <button
                                                    onClick={() => onModerateStatus(p._id, 'inactive')}
                                                    disabled={p.status === 'inactive'}
                                                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition-colors"
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
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors"
                                                    title="Preview in Storefront"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => onDeleteProduct(p._id, p.name)}
                                                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
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
    );
}
