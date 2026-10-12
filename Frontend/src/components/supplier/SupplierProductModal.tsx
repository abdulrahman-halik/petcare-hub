'use client';

import React, { useState, useEffect } from 'react';
import { X, UploadCloud, AlertTriangle, CheckCircle2, Package } from 'lucide-react';
import axios from '@/lib/axiosConfig';

interface SupplierProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    editingProduct: any | null;
    categories: any[];
}

export default function SupplierProductModal({
    isOpen,
    onClose,
    onSaved,
    editingProduct,
    categories
}: SupplierProductModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [petType, setPetType] = useState('all');
    const [features, setFeatures] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editingProduct) {
            setName(editingProduct.name || '');
            setDescription(editingProduct.description || '');
            setPrice(editingProduct.price ? String(editingProduct.price) : '');
            setStock(editingProduct.stock !== undefined ? String(editingProduct.stock) : '');
            setCategory(editingProduct.category?._id || editingProduct.category || '');
            setBrand(editingProduct.brand || '');
            setPetType(editingProduct.petType || 'all');
            setFeatures(Array.isArray(editingProduct.features) ? editingProduct.features.join(', ') : (editingProduct.features || ''));
            setImageUrl(editingProduct.imageUrl || editingProduct.images?.[0] || '');
        } else {
            setName('');
            setDescription('');
            setPrice('');
            setStock('');
            setCategory(categories[0]?._id || '');
            setBrand('');
            setPetType('all');
            setFeatures('');
            setImageUrl('');
        }
        setFormError('');
    }, [editingProduct, categories, isOpen]);

    if (!isOpen) return null;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            const data = new FormData();
            data.append('image', file);
            data.append('folder', 'petcare-hub/products');

            const res = await axios.post('/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.data?.url) {
                setImageUrl(res.data.data.url);
            }
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Image upload failed');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setSubmitting(true);

        try {
            const payload = {
                name: name.trim(),
                description: description.trim(),
                price: Number(price),
                stock: Number(stock),
                category,
                brand: brand.trim(),
                petType,
                features: features.split(',').map(f => f.trim()).filter(Boolean),
                imageUrl,
                images: imageUrl ? [imageUrl] : []
            };

            if (editingProduct) {
                await axios.put(`/products/${editingProduct._id}`, payload);
            } else {
                await axios.post('/products', payload);
            }

            onSaved();
            onClose();
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Failed to save product');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 my-8">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                            {editingProduct ? 'Edit Catalog Product' : 'Add New Inventory Item'}
                        </h2>
                        <p className="text-xs text-gray-500">Provide product specifications and inventory levels</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {formError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Product Title *</label>
                        <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Organic Grain-Free Salmon Kibble"
                            className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Category *</label>
                            <select required value={category} onChange={e => setCategory(e.target.value)}
                                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none">
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Target Pet Type</label>
                            <select value={petType} onChange={e => setPetType(e.target.value)}
                                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none">
                                <option value="all">All Pets / Universal</option>
                                <option value="dog">Dog</option>
                                <option value="cat">Cat</option>
                                <option value="bird">Bird</option>
                                <option value="fish">Fish</option>
                                <option value="small-pet">Small Pet</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Price ($ USD) *</label>
                            <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} placeholder="29.99"
                                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Stock Quantity *</label>
                            <input type="number" required value={stock} onChange={e => setStock(e.target.value)} placeholder="50"
                                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Brand Name</label>
                            <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. Purina, K-Tuff"
                                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Product Image</label>
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                                {imageUrl ? <img src={imageUrl} alt="preview" className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-gray-400" />}
                            </div>
                            <label className="cursor-pointer inline-flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold px-3 py-2 rounded-xl transition-all">
                                <UploadCloud className="w-4 h-4" />
                                <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                            </label>
                            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Or paste image URL"
                                className="flex-1 bg-[#f8fafc] border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Description *</label>
                        <textarea rows={3} required value={description} onChange={e => setDescription(e.target.value)}
                            placeholder="Detailed ingredients, materials, usage instructions..."
                            className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none" />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Features & Highlights (Comma separated)</label>
                        <input value={features} onChange={e => setFeatures(e.target.value)} placeholder="e.g. 100% Grain-Free, Made in USA, Vet Recommended"
                            className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none" />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Publish Product'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
