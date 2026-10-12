'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ExternalLink, Edit, Trash2 } from 'lucide-react';

interface SupplierProductTableProps {
    products: any[];
    loading: boolean;
    onEdit: (product: any) => void;
    onDelete: (id: string, name: string) => void;
}

export default function SupplierProductTable({
    products,
    loading,
    onEdit,
    onDelete
}: SupplierProductTableProps) {
    if (loading) {
        return (
            <div className="p-8 text-center text-gray-500 font-semibold text-sm">
                Loading supplier catalog...
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="p-12 text-center space-y-3">
                <Package className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-base font-bold text-gray-900">No products listed</h3>
                <p className="text-gray-500 text-xs max-w-sm mx-auto">
                    Publish your first pet product listing with inventory count, description, and photos.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-[#f8fafc] text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">
                    <tr>
                        <th className="py-3.5 px-5">Product</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Inventory</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="py-3.5 px-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                                        {p.imageUrl || p.images?.[0] ? (
                                            <img
                                                src={p.imageUrl || p.images?.[0]}
                                                alt={p.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Package className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                                        <p className="text-xs text-gray-400">{p.brand || 'Unbranded'}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3.5 px-4 text-xs font-semibold text-gray-600">
                                {p.category?.name || 'General'}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-gray-900">
                                ${p.price?.toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4">
                                <span
                                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                                        p.stock === 0
                                            ? 'bg-rose-50 text-rose-700'
                                            : p.stock <= 5
                                            ? 'bg-amber-50 text-amber-700'
                                            : 'bg-emerald-50 text-emerald-700'
                                    }`}
                                >
                                    {p.stock} units
                                </span>
                            </td>
                            <td className="py-3.5 px-4">
                                <span
                                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                                        p.status === 'active'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : p.status === 'flagged'
                                            ? 'bg-amber-50 text-amber-700'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {p.status}
                                </span>
                            </td>
                            <td className="py-3.5 px-5 text-right">
                                <div className="inline-flex items-center gap-1">
                                    <Link
                                        href={`/products/${p._id}`}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                        title="View Live Listing"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => onEdit(p)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                                        title="Edit Product"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(p._id, p.name)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                        title="Delete Product"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
