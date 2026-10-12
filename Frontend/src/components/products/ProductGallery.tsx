'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
    selectedImage: string;
    onSelectImage: (img: string) => void;
    productName: string;
    petType?: string;
}

export default function ProductGallery({
    images,
    selectedImage,
    onSelectImage,
    productName,
    petType
}: ProductGalleryProps) {
    const displayImage = selectedImage || images[0] || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80';

    return (
        <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm flex items-center justify-center p-8 group">
                <img
                    src={displayImage}
                    alt={productName}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />

                {petType && petType !== 'all' && (
                    <div className="absolute top-4 left-4 bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-500/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="capitalize">{petType} Specific</span>
                    </div>
                )}
            </div>

            {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => onSelectImage(img)}
                            className={`w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 p-1 shrink-0 transition-all ${
                                selectedImage === img
                                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 scale-105'
                                    : 'border-gray-200 hover:border-gray-300 opacity-75 hover:opacity-100'
                            }`}
                        >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
