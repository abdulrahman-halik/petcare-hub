'use client';

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface CategoryCardProps {
    category: any;
    onEdit: (cat: any) => void;
    onDelete: (id: string, name: string) => void;
}

export default function CategoryCard({
    category,
    onEdit,
    onDelete
}: CategoryCardProps) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
                <div className="aspect-16/9 rounded-xl overflow-hidden bg-gray-100 relative">
                    <img
                        src={category.image || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80'}
                        alt={category.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                            category.isActive !== false ? 'bg-emerald-600 text-white' : 'bg-gray-600 text-white'
                        }`}>
                            {category.isActive !== false ? 'Active' : 'Draft'}
                        </span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-gray-900">{category.name}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 font-semibold">
                            {category.productCount ?? 0} items
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {category.description || 'No description provided.'}
                    </p>
                </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-mono">
                    /{category.slug || category._id}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(category)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Edit Category"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(category._id, category.name)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Category"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
