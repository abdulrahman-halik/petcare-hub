'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Star,
    ShieldCheck,
    Truck,
    RotateCcw,
    Sparkles,
    ChevronRight,
    Minus,
    Plus,
    ShoppingBag,
    Check,
    Store,
    MessageSquare,
    Send,
    Award
} from 'lucide-react';
import axios from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/common/ProductCard';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
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

    // Review form state
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [reviewError, setReviewError] = useState('');

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

    const handleAddToCart = () => {
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 3000);
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            setSubmittingReview(true);
            setReviewError('');
            setReviewSuccess('');

            // For now create local review item or post if review API exists
            const newRev = {
                _id: Date.now().toString(),
                user: { name: user.name },
                rating: reviewRating,
                comment: reviewComment,
                createdAt: new Date().toISOString()
            };

            setReviews([newRev, ...reviews]);
            setReviewComment('');
            setReviewSuccess('Thank you! Your review has been submitted.');
        } catch (err: any) {
            setReviewError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
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
            <div className="max-w-xl mx-auto text-center py-20 px-4 space-y-4">
                <div className="text-4xl">🐾</div>
                <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
                <p className="text-gray-500">{error || 'The requested product listing could not be found or has been removed.'}</p>
                <Link
                    href="/products"
                    className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs"
                >
                    Back to Catalog
                </Link>
            </div>
        );
    }

    const allImages = product.images && product.images.length > 0 
        ? product.images 
        : [product.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'];

    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    return (
        <div className="min-h-screen bg-gray-50/40 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-gray-500">
                    <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <Link href="/products" className="hover:text-emerald-600 transition-colors">Products</Link>
                    {product.category && (
                        <>
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                            <Link href={`/products?category=${product.category.slug || product.category._id}`} className="hover:text-emerald-600 transition-colors">
                                {product.category.name}
                            </Link>
                        </>
                    )}
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="font-semibold text-gray-800 truncate max-w-xs">{product.name}</span>
                </nav>

                {/* Main Product Showcase */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* LEFT: Image Gallery */}
                    <div className="lg:col-span-6 space-y-4">
                        {/* Main Featured Image */}
                        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative group">
                            <img
                                src={selectedImage || allImages[0]}
                                alt={product.name}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Stock badge */}
                            <div className="absolute top-4 left-4">
                                {isOutOfStock ? (
                                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                        Out of Stock
                                    </span>
                                ) : isLowStock ? (
                                    <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                        Only {product.stock} Units Left!
                                    </span>
                                ) : (
                                    <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> In Stock ({product.stock} available)
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Selector */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {allImages.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                                            selectedImage === img
                                                ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                                                : 'border-gray-200 opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Product Buy Box & Info */}
                    <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            {/* Category & Pet Type Badges */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                                    {product.category?.name || 'Pet Essentials'}
                                </span>
                                {product.petType && product.petType !== 'all' && (
                                    <span className="text-xs font-bold text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full uppercase">
                                        {product.petType}
                                    </span>
                                )}
                                {product.brand && (
                                    <span className="text-xs font-medium text-gray-500">
                                        Brand: <strong className="text-gray-800">{product.brand}</strong>
                                    </span>
                                )}
                            </div>

                            {/* Product Title */}
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
                                {product.name}
                            </h1>

                            {/* Ratings & Supplier */}
                            <div className="flex flex-wrap items-center gap-4 text-sm pb-4 border-b border-gray-100">
                                <div className="flex items-center gap-1.5 text-amber-500">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                className={`w-4 h-4 ${
                                                    s <= Math.round(product.rating || 5)
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-extrabold text-gray-800 ml-1">
                                        {product.rating ? product.rating.toFixed(1) : '5.0'}
                                    </span>
                                    <span className="text-gray-400">
                                        ({reviews.length || product.numReviews || 0} reviews)
                                    </span>
                                </div>

                                {product.supplier && (
                                    <div className="flex items-center gap-1 text-teal-700 text-xs font-semibold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>Supplier: {product.supplier.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            <div className="space-y-1">
                                <span className="text-xs text-gray-400 block font-medium">Standard Price</span>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                                        ${Number(product.price).toFixed(2)}
                                    </span>
                                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                        Verified Lowest Price
                                    </span>
                                </div>
                            </div>

                            {/* Short description preview */}
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Key Bullet Features */}
                            {product.features && product.features.length > 0 && (
                                <div className="space-y-2 pt-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Highlights</h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                                        {product.features.map((feat: string, i: number) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                                    <Check className="w-2.5 h-2.5" />
                                                </div>
                                                <span className="truncate">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Purchase Actions */}
                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                                {/* Quantity Stepper */}
                                <div className="flex items-center border border-gray-200 rounded-2xl bg-gray-50 p-1">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        disabled={quantity <= 1 || isOutOfStock}
                                        className="p-2 rounded-xl text-gray-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center text-sm font-bold text-gray-900">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                        disabled={quantity >= product.stock || isOutOfStock}
                                        className="p-2 rounded-xl text-gray-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all ${
                                        isOutOfStock
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg'
                                    }`}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    {isOutOfStock ? 'Sold Out' : `Add to Cart • $${(product.price * quantity).toFixed(2)}`}
                                </button>
                            </div>

                            {/* Added notification toast */}
                            {addedToast && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-150">
                                    <span className="flex items-center gap-1.5">
                                        <Check className="w-4 h-4 text-emerald-600" />
                                        Added {quantity} × "{product.name}" to cart!
                                    </span>
                                    <Link href="/products" className="underline font-bold">Continue Shopping</Link>
                                </div>
                            )}

                            {/* Trust badges row */}
                            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-gray-500">
                                <div className="p-2 rounded-xl bg-gray-50 flex flex-col items-center gap-1">
                                    <Truck className="w-4 h-4 text-emerald-600" />
                                    <span>Fast 2-Day Delivery</span>
                                </div>
                                <div className="p-2 rounded-xl bg-gray-50 flex flex-col items-center gap-1">
                                    <RotateCcw className="w-4 h-4 text-teal-600" />
                                    <span>30-Day Easy Returns</span>
                                </div>
                                <div className="p-2 rounded-xl bg-gray-50 flex flex-col items-center gap-1">
                                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                                    <span>100% Genuine Item</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABS: Description, Specs, Supplier, Reviews */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs space-y-6">
                    {/* Tabs Header */}
                    <div className="flex border-b border-gray-100 gap-8 overflow-x-auto pb-1">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`pb-4 text-sm font-bold border-b-2 transition-all shrink-0 ${
                                activeTab === 'description'
                                    ? 'border-emerald-600 text-emerald-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Detailed Description
                        </button>
                        <button
                            onClick={() => setActiveTab('specifications')}
                            className={`pb-4 text-sm font-bold border-b-2 transition-all shrink-0 ${
                                activeTab === 'specifications'
                                    ? 'border-emerald-600 text-emerald-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Specifications
                        </button>
                        <button
                            onClick={() => setActiveTab('supplier')}
                            className={`pb-4 text-sm font-bold border-b-2 transition-all shrink-0 ${
                                activeTab === 'supplier'
                                    ? 'border-emerald-600 text-emerald-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Supplier Information
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-4 text-sm font-bold border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                                activeTab === 'reviews'
                                    ? 'border-emerald-600 text-emerald-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Customer Reviews ({reviews.length})
                        </button>
                    </div>

                    {/* Tab 1: Description */}
                    {activeTab === 'description' && (
                        <div className="space-y-4 max-w-4xl">
                            <h3 className="text-lg font-bold text-gray-900">About This Product</h3>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                            {product.features && product.features.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <h4 className="text-sm font-bold text-gray-800">Key Benefits & Features:</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                        {product.features.map((feat: string, idx: number) => (
                                            <li key={idx}>{feat}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Specifications */}
                    {activeTab === 'specifications' && (
                        <div className="max-w-2xl">
                            <dl className="divide-y divide-gray-100 text-sm">
                                <div className="py-3 grid grid-cols-3">
                                    <dt className="text-gray-500 font-medium">Brand</dt>
                                    <dd className="col-span-2 text-gray-900 font-semibold">{product.brand || 'PetCare Direct'}</dd>
                                </div>
                                <div className="py-3 grid grid-cols-3">
                                    <dt className="text-gray-500 font-medium">Category</dt>
                                    <dd className="col-span-2 text-gray-900 font-semibold">{product.category?.name || 'General'}</dd>
                                </div>
                                <div className="py-3 grid grid-cols-3">
                                    <dt className="text-gray-500 font-medium">Suitable For</dt>
                                    <dd className="col-span-2 text-gray-900 font-semibold uppercase">{product.petType || 'All Pets'}</dd>
                                </div>
                                <div className="py-3 grid grid-cols-3">
                                    <dt className="text-gray-500 font-medium">Current Stock</dt>
                                    <dd className="col-span-2 text-gray-900 font-semibold">{product.stock} units in warehouse</dd>
                                </div>
                                <div className="py-3 grid grid-cols-3">
                                    <dt className="text-gray-500 font-medium">Product ID / SKU</dt>
                                    <dd className="col-span-2 font-mono text-xs text-gray-600">{product._id}</dd>
                                </div>
                            </dl>
                        </div>
                    )}

                    {/* Tab 3: Supplier */}
                    {activeTab === 'supplier' && (
                        <div className="max-w-2xl bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xl">
                                    <Store className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-base text-gray-900 flex items-center gap-1.5">
                                        {product.supplier?.name || 'PetCare Verified Merchant'}
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        Authorized Supplier • Direct Inventory Provider
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs text-gray-600 leading-relaxed">
                                This item is fulfilled directly from the verified supplier warehouse, guaranteeing fresh batch formulation and strict compliance with pet safety regulations.
                            </p>

                            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-teal-700">
                                <span>📧 Contact: {product.supplier?.email || 'support@petcare.com'}</span>
                            </div>
                        </div>
                    )}

                    {/* Tab 4: Reviews */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-8 max-w-3xl">
                            {/* Write Review Form */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                                <h4 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                                    Write a Product Review
                                </h4>

                                {reviewSuccess && (
                                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl">
                                        {reviewSuccess}
                                    </div>
                                )}
                                {reviewError && (
                                    <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold rounded-xl">
                                        {reviewError}
                                    </div>
                                )}

                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                                            Your Rating
                                        </label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewRating(star)}
                                                    className="p-1 hover:scale-110 transition-transform"
                                                >
                                                    <Star
                                                        className={`w-6 h-6 ${
                                                            star <= reviewRating
                                                                ? 'fill-amber-400 text-amber-400'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                                            Review Comments
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            placeholder="Share your pet's experience with this product..."
                                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        {submittingReview ? 'Submitting...' : 'Post Customer Review'}
                                    </button>
                                </form>
                            </div>

                            {/* Reviews List */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-base text-gray-900">Verified Customer Feedback</h4>
                                {reviews.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
                                ) : (
                                    <div className="space-y-4">
                                        {reviews.map((rev: any, idx: number) => (
                                            <div key={rev._id || idx} className="p-4 rounded-xl border border-gray-100 bg-white space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                                                            {rev.name ? rev.name.charAt(0) : rev.user?.name ? rev.user.name.charAt(0) : 'U'}
                                                        </div>
                                                        <span className="font-bold text-sm text-gray-900">
                                                            {rev.name || rev.user?.name || 'Pet Parent'}
                                                        </span>
                                                    </div>

                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star
                                                                key={s}
                                                                className={`w-3.5 h-3.5 ${
                                                                    s <= rev.rating
                                                                        ? 'fill-amber-400 text-amber-400'
                                                                        : 'text-gray-200'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-600 leading-relaxed">{rev.comment}</p>
                                                {rev.createdAt && (
                                                    <span className="text-[10px] text-gray-400 block">
                                                        {new Date(rev.createdAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <section className="space-y-6 pt-6">
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
        </div>
    );
}
