'use client';

import React from 'react';
import { X, UploadCloud, RefreshCw, Shield } from 'lucide-react';

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEdit: boolean;
    name: string;
    setName: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    image: string;
    setImage: (v: string) => void;
    icon: string;
    setIcon: (v: string) => void;
    isActive: boolean;
    setIsActive: (v: boolean) => void;
    uploadingImage: boolean;
    formError: string;
    onSubmit: (e: React.FormEvent) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CategoryFormModal({
    isOpen,
    onClose,
    isEdit,
    name,
    setName,
    description,
    setDescription,
    image,
    setImage,
    icon,
    setIcon,
    isActive,
    setIsActive,
    uploadingImage,
    formError,
    onSubmit,
    onImageUpload
}: CategoryFormModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {isEdit ? 'Edit Category' : 'Create New Category'}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {isEdit ? 'Modify category taxonomy and media.' : 'Add a new product category to the storefront.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {formError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                        {formError}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Organic Nutrition & Food"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Briefly describe what items belong in this department..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    {/* Image Upload Area */}
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                            Cover Image (Cloudinary)
                        </label>
                        <div className="flex items-center gap-4">
                            {image ? (
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0 relative group">
                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImage('')}
                                        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : null}

                            <label className="cursor-pointer flex-1 border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-xl p-3 flex items-center justify-center gap-2 text-gray-500 hover:text-emerald-700 text-xs font-semibold transition-all">
                                {uploadingImage ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                                        <span>Uploading to Cloudinary...</span>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="w-4 h-4 text-emerald-600" />
                                        <span>Upload Thumbnail</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    disabled={uploadingImage}
                                    onChange={onImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                Icon Keyword
                            </label>
                            <input
                                type="text"
                                placeholder="Package, Star, Bone..."
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                Status
                            </label>
                            <select
                                value={isActive ? 'active' : 'draft'}
                                onChange={(e) => setIsActive(e.target.value === 'active')}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="active">Active (Visible)</option>
                                <option value="draft">Draft (Hidden)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploadingImage}
                            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-xs transition-colors flex items-center gap-1.5"
                        >
                            <Shield className="w-3.5 h-3.5" />
                            <span>{isEdit ? 'Save Changes' : 'Create Category'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
