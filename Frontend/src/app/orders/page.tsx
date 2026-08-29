'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthContext';

const statusIcon: Record<string, React.ReactNode> = {
    pending: <Clock className="w-4 h-4 text-amber-500" />,
    processing: <Package className="w-4 h-4 text-blue-500" />,
    shipped: <Truck className="w-4 h-4 text-indigo-500" />,
    delivered: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    cancelled: <XCircle className="w-4 h-4 text-red-500" />
};

const statusColor: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200'
};

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        axios.get('/orders').then(({ data }) => setOrders(data.data.orders || [])).catch(() => setOrders([])).finally(() => setLoading(false));
    }, [user]);

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
            <div><Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Sign in to view your orders</h2>
                <Link href="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-emerald-700 inline-block mt-2">Sign In</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-8">
                    <Package className="w-6 h-6 text-emerald-600" /> My Orders
                </h1>

                {loading ? (
                    <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)}</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
                        <p className="text-gray-400 mb-6">Complete a purchase to see your orders here.</p>
                        <Link href="/products" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 inline-block">Browse Products</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <Link key={order._id} href={`/orders/${order._id}`} className="block bg-white rounded-2xl shadow-xs border border-gray-100 p-5 hover:shadow-md hover:border-emerald-200 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-mono text-xs text-gray-400 mb-0.5">#{order._id.slice(-8).toUpperCase()}</p>
                                        <p className="font-bold text-gray-900">${order.total?.toFixed(2)}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${statusColor[order.orderStatus] || statusColor.pending}`}>
                                            {statusIcon[order.orderStatus] || statusIcon.pending}
                                            {order.orderStatus ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1) : 'Processing'}
                                        </span>
                                        <span className="text-sm text-gray-400 group-hover:text-emerald-600 transition-colors">View →</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    {(order.items || []).slice(0, 4).map((item: any, idx: number) => (
                                        <div key={idx} className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                            {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-base">🐾</div>}
                                        </div>
                                    ))}
                                    {(order.items?.length || 0) > 4 && <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-semibold">+{order.items.length - 4}</div>}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
