'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Package, MapPin, CreditCard, Clock, CheckCircle, Truck, ArrowLeft } from 'lucide-react';
import axios from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthContext';

const statusColor: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200'
};

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id || !user) { setLoading(false); return; }
        axios.get(`/orders/${id}`).then(({ data }) => setOrder(data.data.order)).catch(e => setError(e.response?.data?.message || 'Order not found')).finally(() => setLoading(false));
    }, [id, user]);

    if (!user) return <div className="min-h-screen flex items-center justify-center"><Link href="/login" className="text-emerald-600 underline">Sign in</Link></div>;
    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" /></div>;
    if (error || !order) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Order not found'}</div>;

    const addr = order.shippingAddress;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Orders
                </Link>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Package className="w-5 h-5 text-emerald-600" /> Order Details</h1>
                        <p className="text-xs text-gray-400 font-mono mt-1">#{order._id}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColor[order.orderStatus] || statusColor.processing}`}>
                        {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Processing'}
                    </span>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 mb-4">
                    <h2 className="font-semibold text-gray-800 mb-4">Items Ordered</h2>
                    <div className="space-y-3">
                        {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-3 items-center">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🐾</div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                                    <p className="text-xs text-gray-400">${item.unitPrice?.toFixed(2)} × {item.quantity}</p>
                                </div>
                                <span className="font-bold text-gray-800 text-sm">${item.subtotal?.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-600"><span>Tax (10%)</span><span>${order.tax?.toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `$${order.shippingFee?.toFixed(2)}`}</span></div>
                        <div className="flex justify-between font-bold text-gray-900 border-t pt-2"><span>Total Paid</span><span>${order.total?.toFixed(2)}</span></div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5">
                        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-500" /> Shipping Address</h2>
                        <p className="text-sm text-gray-700">{addr.firstName} {addr.lastName}</p>
                        <p className="text-sm text-gray-500">{addr.address}</p>
                        <p className="text-sm text-gray-500">{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postalCode}</p>
                        <p className="text-sm text-gray-500">{addr.country}</p>
                        {addr.phone && <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>}
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5">
                        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-emerald-500" /> Payment</h2>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Provider</span><span className="font-medium capitalize">{order.payment?.provider || 'mock'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Status</span>
                                <span className={`font-semibold capitalize ${order.payment?.status === 'paid' ? 'text-emerald-600' : 'text-red-500'}`}>{order.payment?.status}</span>
                            </div>
                            <div className="flex justify-between text-xs"><span className="text-gray-400">Ref</span><span className="font-mono text-gray-400 truncate max-w-32">{order.payment?.transactionId}</span></div>
                            {order.payment?.paidAt && <div className="flex justify-between text-xs"><span className="text-gray-400">Paid at</span><span className="text-gray-500">{new Date(order.payment.paidAt).toLocaleString()}</span></div>}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link href="/orders" className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm">← My Orders</Link>
                    <Link href="/products" className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
}
