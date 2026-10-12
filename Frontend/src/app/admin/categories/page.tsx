'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    SlidersHorizontal,
    Plus,
    Search,
    RefreshCw
} from 'lucide-react';
import axios from '@/lib/axiosConfig';
import CategoryCard from '@/components/admin/CategoryCard';
import CategoryFormModal from '@/components/admin/CategoryFormModal';

export default function AdminCategoriesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [icon, setIcon] = useState('Package');
    const [isActive, setIsActive] = useState(true);
    const [formError, setFormError] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
                        <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                        <span>Taxonomy Architecture</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Category Management
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Structure shop departments, upload promotional collection covers, and organize catalog filters.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleOpenAdd}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Category</span>
                    </button>
                    <button
                        onClick={fetchCategories}
                        className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-xs"
                        title="Refresh Categories"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center justify-between gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                        type="text"
                        placeholder="Filter categories by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                </div>
                <span className="text-xs font-semibold text-gray-500">
                    {filteredCategories.length} Categories Active
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse space-y-4">
                            <div className="h-32 bg-gray-200 rounded-xl"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))
                ) : filteredCategories.length === 0 ? (
                    <div className="col-span-full bg-white p-12 rounded-2xl text-center border border-gray-200/80 text-gray-500">
                        No categories found. Click <strong>"Add Category"</strong> to create one.
                    </div>
                ) : (
                    filteredCategories.map((cat) => (
                        <CategoryCard
                            key={cat._id}
                            category={cat}
                            onEdit={handleOpenEdit}
                            onDelete={handleDeleteCategory}
                        />
                    ))
                )}
            </div>

            <CategoryFormModal
                isOpen={isAddModalOpen || isEditModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                }}
                isEdit={isEditModalOpen}
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                image={image}
                setImage={setImage}
                icon={icon}
                setIcon={setIcon}
                isActive={isActive}
                setIsActive={setIsActive}
                uploadingImage={uploadingImage}
                formError={formError}
                onSubmit={isEditModalOpen ? handleUpdateCategory : handleCreateCategory}
                onImageUpload={handleCategoryImgUpload}
            />
        </div>
    );
}
