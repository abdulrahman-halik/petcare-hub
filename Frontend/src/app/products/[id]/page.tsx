'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Sparkles, Store, MessageSquare } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/common/ProductCard';
import ProductGallery from '@/components/products/ProductGallery';
import ProductActionPanel from '@/components/products/ProductActionPanel';
import ProductReviewsSection from '@/components/products/ProductReviewsSection';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const productId = (params?.id as string) || '';

    const [product, setProduct] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'supplier' | 'reviews'>('description');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addedToast, setAddedToast] = useState(false);
    const [addingCart, setAddingCart] = useState(false);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                setError('');
                const { data } = await axios.get(`/products/${productId}`);
                const prod = data.data.product;
                setProduct(prod);
                setReviews(data.data.reviews || []);
                setRelatedProducts(data.data.relatedProducts || []);

                const defaultImg = prod.imageUrl || (prod.images && prod.images[0]) || '';
                setSelectedImage(defaultImg);
            } catch (err: any) {
                console.error('Error loading product details:', err);
                setError(err.response?.data?.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductDetail();
        }
    }, [productId]);

    const handleAddToCart = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        try {
            setAddingCart(true);
            await addToCart(productId, quantity);
            setAddedToast(true);
            setTimeout(() => setAddedToast(false), 3000);
        } catch (err) {
            console.error('Failed to add to cart:', err);
        } finally {
            setAddingCart(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-3xl"></div>
                    <div className="space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
                <p className="text-gray-500 text-sm">{error || 'This listing may have been moved or deactivated.'}</p>
                <Link href="/products" className="inline-block bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                    Back to Catalog
                </Link>
            </div>
        );
    }

    const allImages = (product.images && product.images.length > 0)
        ? product.images
        : (product.imageUrl ? [product.imageUrl] : []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                <Link href="/" className="hover:text-gray-700">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/products" className="hover:text-gray-700">Catalog</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                {product.category && (
                    <>
                        <Link href={`/products?category=${product.category.slug || product.category._id}`} className="hover:text-gray-700">
                            {product.category.name}
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </>
                )}
                <span className="text-gray-800 truncate max-w-xs">{product.name}</span>
            </nav>

            {/* Main Product Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <ProductGallery
                    images={allImages}
                    selectedImage={selectedImage}
                    onSelectImage={setSelectedImage}
                    productName={product.name}
                    petType={product.petType}
                />

                <ProductActionPanel
                    product={product}
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    onAddToCart={handleAddToCart}
                    addingCart={addingCart}
                    addedToast={addedToast}
                />
            </div>

            {/* Tabs for Details, Specs, Supplier, Reviews */}
            <div className="pt-8 border-t border-gray-100 space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
                    {[
                        { id: 'description', label: 'Product Overview' },
                        { id: 'specifications', label: 'Specifications & Features' },
                        { id: 'supplier', label: 'Verified Vendor' },
                        { id: 'reviews', label: `Reviews (${reviews.length})` }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2.5 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'border-emerald-600 text-emerald-800'
                                    : 'border-transparent text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="max-w-4xl py-2">
                    {activeTab === 'description' && (
                        <div className="prose prose-sm text-gray-600 leading-relaxed space-y-4">
                            <p>{product.description}</p>
                        </div>
                    )}

                    {activeTab === 'specifications' && (
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-900 text-sm">Key Product Features</h4>
                            {product.features && product.features.length > 0 ? (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                                    {product.features.map((f: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-gray-500">Standard vendor specifications apply.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'supplier' && (
                        <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                                <Store className="w-6 h-6 text-teal-700" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{product.supplier?.name || 'Verified PetCare Vendor'}</h4>
                                <p className="text-xs text-gray-500">Authorized marketplace partner with strict quality controls.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <ProductReviewsSection
                            productId={productId}
                            reviews={reviews}
                            onReviewAdded={(newRev) => setReviews([newRev, ...reviews])}
                        />
                    )}
                </div>
            </div>

            {/* RELATED PRODUCTS */}
            {relatedProducts.length > 0 && (
                <section className="space-y-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                            You May Also Like
                        </h3>
                        <Link
                            href={`/products?category=${product.category?.slug || product.category?._id}`}
                            className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
                        >
                            More in {product.category?.name} →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relProd) => (
                            <ProductCard key={relProd._id} product={relProd} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
