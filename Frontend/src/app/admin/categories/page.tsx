'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    SlidersHorizontal,
    Plus,
    Edit,
    Trash2,
    Search,
    RefreshCw,
    X,
    UploadCloud,
    Shield,
    Package,
    CheckCircle2
} from 'lucide-react';
import axios from '@/lib/axiosConfig';
import Link from 'next/link';

export default function AdminCategoriesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [icon, setIcon] = useState('Package');
    const [isActive, setIsActive] = useState(true);
    const [formError, setFormError] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

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

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/categories');
            setCategories(data.data.categories || []);
        } catch (err: any) {
            console.error('Error loading categories:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchCategories();
        }
    }, [user]);

    // Handle Cloudinary Image upload for Category
    const handleCategoryImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploadingImage(true);
            setFormError('');
            const data = new FormData();
            data.append('image', files[0]);
            data.append('folder', 'petcare-hub/categories');

            const res = await axios.post('/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setImage(res.data.data.url);
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Failed to upload category image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleOpenAdd = () => {
        setName('');
        setDescription('');
        setImage('');
        setIcon('Package');
        setIsActive(true);
        setFormError('');
        setIsAddModalOpen(true);
    };

    const handleOpenEdit = (cat: any) => {
        setSelectedCategory(cat);
        setName(cat.name);
        setDescription(cat.description || '');
        setImage(cat.image || '');
        setIcon(cat.icon || 'Package');
        setIsActive(cat.isActive !== undefined ? cat.isActive : true);
        setFormError('');
        setIsEditModalOpen(true);
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setFormError('');
            await axios.post('/categories', {
                name,
                description,
                image,
                icon,
                isActive
            });
            setIsAddModalOpen(false);
            fetchCategories();
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Failed to create category');
        }
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setFormError('');
            await axios.put(`/categories/${selectedCategory._id}`, {
                name,
                description,
                image,
                icon,
                isActive
            });
            setIsEditModalOpen(false);
            fetchCategories();
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Failed to update category');
        }
    };

    const handleDeleteCategory = async (id: string, catName: string) => {
        if (confirm(`Admin Action: Are you sure you want to delete category "${catName}"?`)) {
            try {
                await axios.delete(`/categories/${id}`);
                fetchCategories();
            } catch (err: any) {
                alert(err.response?.data?.message || 'Failed to delete category');
            }
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Catalog Architecture</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Category Management
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/products"
                            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm px-4 py-2.5 rounded-xl border border-gray-200 shadow-xs transition-colors"
                        >
                            <Shield className="w-4 h-4 text-purple-600" />
                            Product Moderation
                        </Link>
                        <button
                            onClick={handleOpenAdd}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Category
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            placeholder="Filter categories by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <span className="text-xs font-semibold text-gray-500">
                        {filteredCategories.length} Categories
                    </span>
                </div>

                {/* CATEGORIES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse space-y-4">
                                <div className="h-32 bg-gray-200 rounded-xl"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))
                    ) : filteredCategories.length === 0 ? (
                        <div className="col-span-full bg-white p-12 rounded-2xl text-center border border-gray-100 text-gray-500">
                            No categories found. Click <strong>"Add New Category"</strong> to create one.
                        </div>
                    ) : (
                        filteredCategories.map((cat) => (
                            <div
                                key={cat._id}
                                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-3">
                                    <div className="aspect-16/9 rounded-xl overflow-hidden bg-gray-100 relative">
                                        <img
                                            src={cat.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'}
                                            alt={cat.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                                            {cat.productCount !== undefined ? `${cat.productCount} Products` : '0 Products'}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-extrabold text-base text-gray-900">{cat.name}</h3>
                                        <p className="text-xs text-gray-400 font-mono">slug: {cat.slug}</p>
                                        <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{cat.description || 'No description provided.'}</p>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <Link
                                        href={`/products?category=${cat.slug || cat._id}`}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700"
                                    >
                                        View Products →
                                    </Link>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenEdit(cat)}
                                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                            title="Edit Category"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(cat._id, cat.name)}
                                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50"
                                            title="Delete Category"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ADD / EDIT CATEGORY MODAL */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
                    <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 space-y-6 animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div>
                                <h3 className="text-xl font-extrabold text-gray-900">
                                    {isAddModalOpen ? 'Create Product Category' : 'Edit Product Category'}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Manage marketplace taxonomy and high-level categorization
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsAddModalOpen(false);
                                    setIsEditModalOpen(false);
                                }}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {formError && (
                            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={isAddModalOpen ? handleCreateCategory : handleUpdateCategory} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Dog Food & Treats"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief summary of products in this category..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Image Upload for Category */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                                    Category Cover Image
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="file"
                                        id="cat-img-file"
                                        accept="image/*"
                                        onChange={handleCategoryImgUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="cat-img-file"
                                        className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                                    >
                                        <UploadCloud className="w-4 h-4" />
                                        {uploadingImage ? 'Uploading...' : 'Upload Image (Cloudinary)'}
                                    </label>
                                    {image && (
                                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                                            <img src={image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="Or paste direct image URL (https://...)"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setIsEditModalOpen(false);
                                    }}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploadingImage}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md disabled:opacity-50"
                                >
                                    {isAddModalOpen ? 'Create Category' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
