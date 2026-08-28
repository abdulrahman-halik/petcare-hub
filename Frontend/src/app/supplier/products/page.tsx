'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    Package,
    Plus,
    UploadCloud,
    Trash2,
    Edit,
    AlertTriangle,
    CheckCircle2,
    Search,
    Store,
    RefreshCw,
    X,
    Image as ImageIcon,
    ExternalLink,
    Sparkles
} from 'lucide-react';
import axios from '@/lib/axiosConfig';

export default function SupplierProductsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalListings: 0,
        activeListings: 0,
        totalStock: 0,
        lowStockCount: 0,
        outOfStockCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        brand: '',
        petType: 'all',
        features: '',
        imageUrl: '',
        images: [] as string[]
    });

    // Upload state
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    // Authentication Guard
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'supplier' && user.role !== 'admin') {
                router.push('/profile');
            }
        }
    }, [user, authLoading, router]);

    // Fetch Supplier Products & Categories
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

    // Image Upload handler (Cloudinary via Backend API)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploadingImage(true);
            setFormError('');
            const data = new FormData();
            data.append('image', files[0]);
            data.append('folder', 'petcare-hub/products');

            const res = await axios.post('/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const uploadedUrl = res.data.data.url;
            setFormData(prev => ({
                ...prev,
                imageUrl: uploadedUrl,
                images: [...prev.images, uploadedUrl]
            }));
            setFormSuccess('Image uploaded to Cloudinary successfully!');
        } catch (err: any) {
            console.error('Image upload failed:', err);
            setFormError(err.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = (imgUrl: string) => {
        setFormData(prev => {
            const updated = prev.images.filter(img => img !== imgUrl);
            return {
                ...prev,
                images: updated,
                imageUrl: updated[0] || ''
            };
        });
    };

    // Open Add Modal
    const handleOpenAdd = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            category: categories[0]?._id || '',
            brand: '',
            petType: 'all',
            features: '',
            imageUrl: '',
            images: []
        });
        setFormError('');
        setFormSuccess('');
        setIsAddModalOpen(true);
    };

    // Open Edit Modal
    const handleOpenEdit = (product: any) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            stock: product.stock.toString(),
            category: product.category?._id || product.category || '',
            brand: product.brand || '',
            petType: product.petType || 'all',
            features: Array.isArray(product.features) ? product.features.join(', ') : '',
            imageUrl: product.imageUrl || '',
            images: product.images || (product.imageUrl ? [product.imageUrl] : [])
        });
        setFormError('');
        setFormSuccess('');
        setIsEditModalOpen(true);
    };

    // Submit Create Product
    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setFormError('');
            const payload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
            };

            await axios.post('/products', payload);
            setIsAddModalOpen(false);
            loadSupplierData();
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Failed to create product listing');
        }
    };

    // Submit Update Product
    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setFormError('');
            const payload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
            };

            await axios.put(`/products/${selectedProduct._id}`, payload);
            setIsEditModalOpen(false);
            loadSupplierData();
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Failed to update product listing');
        }
    };

    // Delete Product
    const handleDeleteProduct = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            try {
                await axios.delete(`/products/${id}`);
                loadSupplierData();
            } catch (err: any) {
                alert(err.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    // Filtered products
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                            <Store className="w-4 h-4" />
                            <span>Supplier Inventory Center</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Manage Product Catalog & Stock
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadSupplierData}
                            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-xs"
                            title="Refresh Data"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleOpenAdd}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Listing
                        </button>
                    </div>
                </div>

                {/* STATS OVERVIEW CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Listings</p>
                            <h3 className="text-2xl font-black text-gray-900">{stats.totalListings || 0}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active in Store</p>
                            <h3 className="text-2xl font-black text-gray-900">{stats.activeListings || 0}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Store className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inventory Units</p>
                            <h3 className="text-2xl font-black text-gray-900">{stats.totalStock || 0}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Low / Out of Stock</p>
                            <h3 className="text-2xl font-black text-amber-600">
                                {(stats.lowStockCount || 0) + (stats.outOfStockCount || 0)}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* SEARCH & FILTER BAR */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            placeholder="Filter by product name, brand..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <span className="text-xs font-semibold text-gray-500">
                        Showing {filteredProducts.length} of {products.length} products
                    </span>
                </div>

                {/* INVENTORY TABLE */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Product Details</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Unit Price</th>
                                    <th className="px-6 py-4">Stock Level</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                            Loading your inventory listings...
                                        </td>
                                    </tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No listings found. Click <strong>"Add New Listing"</strong> to publish your first pet product!
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((p) => {
                                        const isOut = p.stock <= 0;
                                        const isLow = p.stock > 0 && p.stock <= 5;
                                        const imgUrl = p.imageUrl || (p.images && p.images[0]) || '';

                                        return (
                                            <tr key={p._id} className="hover:bg-gray-50/70 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                                            {imgUrl ? (
                                                                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                    <ImageIcon className="w-5 h-5" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 line-clamp-1 max-w-xs">{p.name}</p>
                                                            <p className="text-xs text-gray-400">Brand: {p.brand || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 font-medium text-gray-700">
                                                    {p.category?.name || 'General'}
                                                </td>

                                                <td className="px-6 py-4 font-black text-gray-900">
                                                    ${Number(p.price).toFixed(2)}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                        isOut
                                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                                            : isLow
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    }`}>
                                                        {isOut ? 'Out of Stock (0)' : isLow ? `Low Stock (${p.stock})` : `${p.stock} In Stock`}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                                                        p.status === 'active'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : p.status === 'flagged'
                                                            ? 'bg-rose-100 text-rose-800'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {p.status}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <a
                                                            href={`/products/${p._id}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-gray-100"
                                                            title="View Live Listing"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                        <button
                                                            onClick={() => handleOpenEdit(p)}
                                                            className="p-1.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                                            title="Edit Details & Stock"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(p._id, p.name)}
                                                            className="p-1.5 rounded-lg text-gray-600 hover:text-rose-600 hover:bg-rose-50"
                                                            title="Delete Listing"
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

            {/* ADD / EDIT PRODUCT MODAL */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
                    <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 space-y-6 animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div>
                                <h3 className="text-xl font-extrabold text-gray-900">
                                    {isAddModalOpen ? 'Add New Product Listing' : 'Edit Product Listing'}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Upload images via Cloudinary & configure real-time inventory
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

                        <form onSubmit={isAddModalOpen ? handleCreateProduct : handleUpdateProduct} className="space-y-5">
                            {/* Product Name */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                                    Product Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Organic Grain-Free Salmon Kibble"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Category & Pet Type */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                                        Category *
                                    </label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((c) => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                                        Pet Type
                                    </label>
                                    <select
                                        value={formData.petType}
                                        onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="all">All Pets</option>
                                        <option value="dog">Dog</option>
                                        <option value="cat">Cat</option>
                                        <option value="bird">Bird</option>
                                        <option value="fish">Fish & Aquatic</option>
                                        <option value="small-pet">Small Pet</option>
                                        <option value="reptile">Reptile</option>
                                    </select>
                                </div>
                            </div>

                            {/* Price, Stock & Brand */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                                        Price ($ USD) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="29.99"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                                        Inventory Stock *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        placeholder="50"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                                        Brand Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        placeholder="e.g. Purina, K-Tuff"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Cloudinary Media Upload Section */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                                    Product Images (Cloudinary Storage)
                                </label>

                                <div className="border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-2xl p-4 text-center transition-colors bg-gray-50/50">
                                    <input
                                        type="file"
                                        id="image-upload-input"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <label htmlFor="image-upload-input" className="cursor-pointer flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <UploadCloud className="w-5 h-5" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-700">
                                            {uploadingImage ? 'Uploading to Cloudinary...' : 'Click to Upload Image'}
                                        </p>
                                        <p className="text-[10px] text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                                    </label>
                                </div>

                                {/* Preview Uploaded Images */}
                                {formData.images.length > 0 && (
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        {formData.images.map((imgUrl, i) => (
                                            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group">
                                                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(imgUrl)}
                                                    className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                                    Full Product Description *
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Detailed ingredients, materials, usage instructions..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Features list */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                                    Highlights / Features (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    placeholder="e.g. 100% Grain-Free, Made in USA, Vet Recommended"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Modal Action buttons */}
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
                                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md disabled:opacity-50"
                                >
                                    {isAddModalOpen ? 'Publish Product Listing' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
