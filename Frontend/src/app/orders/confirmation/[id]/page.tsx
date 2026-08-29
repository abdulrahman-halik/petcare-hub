'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ShoppingBag } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthContext';

export default function OrderConfirmationPage() {
    const params = useParams();
    const id = params?.id as string;
    const { user } = useAuth();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || !user) { setLoading(false); return; }
        axios.get(`/orders/${id}`).then(({ data }) => setOrder(data.data.order)).catch(() => {}).finally(() => setLoading(false));
    }, [id, user]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" /></div>;

    return (
        <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full text-center">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                    <CheckCircle className="w-14 h-14 text-emerald-500" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-500 mb-8">Thank you for your order. Your pets will love it! 🐾</p>

                {order && (
                    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 mb-6 text-left space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Order ID</span>
                            <span className="font-mono font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Total Paid</span>
                            <span className="font-bold text-emerald-700 text-lg">${order.total?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Payment Status</span>
                            <span className="font-semibold text-emerald-600 capitalize">{order.payment?.status || 'paid'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Order Status</span>
                            <span className="font-semibold text-blue-600 capitalize">{order.orderStatus || 'processing'}</span>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <Link href={`/orders/${id}`} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                        <Package className="w-4 h-4" /> View Order Details
                    </Link>
                    <Link href="/products" className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors">
                        <ShoppingBag className="w-4 h-4" /> Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
