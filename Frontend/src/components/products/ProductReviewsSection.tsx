'use client';

import React, { useState } from 'react';
import { Star, Send, Award, CheckCircle2 } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthContext';

interface ProductReviewsSectionProps {
    productId: string;
    reviews: any[];
    onReviewAdded: (newReview: any) => void;
}

export default function ProductReviewsSection({
    productId,
    reviews,
    onReviewAdded
}: ProductReviewsSectionProps) {
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            window.location.href = '/login';
            return;
        }

        try {
            setSubmitting(true);
            setErrorMsg('');
            setSuccessMsg('');

            const { data } = await axios.post(`/products/${productId}/reviews`, {
                rating,
                comment: comment.trim()
            });

            const savedReview = data.data?.review || {
                _id: Date.now().toString(),
                user: { name: user.name },
                name: user.name,
                rating,
                comment: comment.trim(),
                createdAt: new Date().toISOString()
            };

            onReviewAdded(savedReview);
            setComment('');
            setSuccessMsg('Thank you! Your verified review has been posted.');
            setTimeout(() => setSuccessMsg(''), 4000);
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Failed to submit review. (Note: Only verified purchasers who bought this item can review.)');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Review Submission Form */}
            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 space-y-4">
                <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-extrabold text-base text-gray-900">
                        Write a Customer Review
                    </h4>
                </div>

                {successMsg && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{successMsg}</span>
                    </div>
                )}
                {errorMsg && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                            Rating
                        </label>
                        <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1 hover:scale-110 transition-transform"
                                >
                                    <Star
                                        className={`w-6 h-6 ${
                                            star <= rating
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
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your pet's experience with this product..."
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                    >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submitting ? 'Submitting...' : 'Post Customer Review'}</span>
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
    );
}
