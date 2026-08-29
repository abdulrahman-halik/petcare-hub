'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axiosConfig';
import {
  Bell,
  Package,
  PawPrint,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  ClipboardList,
  Activity
} from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      const loadDashboard = async () => {
        try {
          setLoadingData(true);
          const { data } = await axios.get('/dashboard');
          setDashboard(data.data);
        } catch (error) {
          console.error('Failed to load dashboard:', error);
        } finally {
          setLoadingData(false);
        }
      };

      loadDashboard();
    }
  }, [loading, user]);

  if (loading || !user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  const role = user.role;

  const renderCustomer = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Pets" value={dashboard?.stats?.petCount ?? 0} icon={<PawPrint className="w-5 h-5" />} color="emerald" />
        <StatCard label="Active Reminders" value={dashboard?.stats?.activeReminders ?? 0} icon={<Bell className="w-5 h-5" />} color="amber" />
        <StatCard label="Recent Orders" value={dashboard?.stats?.recentOrders ?? 0} icon={<Package className="w-5 h-5" />} color="sky" />
        <StatCard label="Recommended" value={dashboard?.stats?.recommendedProducts ?? 0} icon={<Sparkles className="w-5 h-5" />} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Recent orders">
          {dashboard?.recentOrders?.length ? (
            dashboard.recentOrders.map((order: any) => (
              <div key={order._id} className="flex items-center justify-between border-b last:border-b-0 py-3">
                <div>
                  <p className="font-semibold text-gray-900">Order #{String(order._id).slice(-6)}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-sm font-semibold text-emerald-600">${Number(order.total || 0).toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recent orders yet.</p>
          )}
        </Panel>

        <Panel title="Recommended products">
          {dashboard?.recommendations?.length ? (
            dashboard.recommendations.map((item: any) => (
              <div key={item.product?._id || item._id} className="flex items-center justify-between border-b last:border-b-0 py-3">
                <div>
                  <p className="font-semibold text-gray-900">{item.product?.name}</p>
                  <p className="text-xs text-gray-500">{item.primaryReason}</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-2 py-1">{item.relevanceScore}%</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recommendations loaded.</p>
          )}
        </Panel>
      </div>
    </div>
  );

  const renderSupplier = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Products" value={dashboard?.stats?.totalProducts ?? 0} icon={<Package className="w-5 h-5" />} color="emerald" />
        <StatCard label="Low Stock" value={dashboard?.stats?.lowStockProducts ?? 0} icon={<Activity className="w-5 h-5" />} color="amber" />
        <StatCard label="Active Orders" value={dashboard?.stats?.activeOrders ?? 0} icon={<ClipboardList className="w-5 h-5" />} color="sky" />
        <StatCard label="Revenue" value={`$${Number(dashboard?.stats?.totalRevenue || 0).toFixed(2)}`} icon={<Wallet className="w-5 h-5" />} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Fulfillment queue">
          {dashboard?.recentOrders?.length ? (
            dashboard.recentOrders.map((order: any) => (
              <div key={order._id} className="flex items-center justify-between border-b last:border-b-0 py-3">
                <div>
                  <p className="font-semibold text-gray-900">{order.user?.name || 'Customer'}</p>
                  <p className="text-xs text-gray-500">{order.orderStatus}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">${Number(order.total || 0).toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No orders assigned yet.</p>
          )}
        </Panel>

        <Panel title="Recent listings">
          {dashboard?.recentProducts?.length ? (
            dashboard.recentProducts.map((product: any) => (
              <div key={product._id} className="flex items-center justify-between border-b last:border-b-0 py-3">
                <div>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                </div>
                <span className="text-sm font-semibold text-emerald-600">${Number(product.price || 0).toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recent product listings.</p>
          )}
        </Panel>
      </div>
    </div>
  );

  const renderAdmin = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard label="Sales" value={`$${Number(dashboard?.stats?.totalSales || 0).toFixed(2)}`} icon={<TrendingUp className="w-5 h-5" />} color="emerald" />
        <StatCard label="Orders" value={dashboard?.stats?.totalOrders ?? 0} icon={<ClipboardList className="w-5 h-5" />} color="sky" />
        <StatCard label="Customers" value={dashboard?.stats?.totalCustomers ?? 0} icon={<PawPrint className="w-5 h-5" />} color="amber" />
        <StatCard label="Suppliers" value={dashboard?.stats?.totalSuppliers ?? 0} icon={<ShieldCheck className="w-5 h-5" />} color="purple" />
        <StatCard label="Flagged" value={dashboard?.stats?.flaggedProducts ?? 0} icon={<Activity className="w-5 h-5" />} color="rose" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Top rated products">
          {dashboard?.topRatedProducts?.length ? (
            dashboard.topRatedProducts.map((product: any) => (
              <div key={product._id} className="flex items-center justify-between border-b last:border-b-0 py-3">
                <div>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.numReviews} reviews</p>
                </div>
                <span className="text-sm font-bold text-amber-600">{Number(product.rating || 0).toFixed(1)}★</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No products rated yet.</p>
          )}
        </Panel>

        <Panel title="Recent platform orders">
          {dashboard?.recentOrders?.length ? (
            dashboard.recentOrders.map((order: any) => (
              <div key={order._id} className="flex items-center justify-between border-b last:border-b-0 py-3">
                <div>
                  <p className="font-semibold text-gray-900">{order.user?.name || 'Unknown customer'}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">${Number(order.total || 0).toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recent orders.</p>
          )}
        </Panel>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">PetCare Hub</p>
          <h1 className="text-3xl font-black text-gray-900 mt-1">
            {role === 'customer' && 'Customer Dashboard'}
            {role === 'supplier' && 'Supplier Dashboard'}
            {role === 'admin' && 'Admin Dashboard'}
          </h1>
        </div>
        <Link href="/notifications" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
          <Bell className="w-4 h-4" />
          Notifications
        </Link>
      </div>

      {loadingData ? (
        <div className="text-gray-600">Loading dashboard data...</div>
      ) : (
        <>
          {role === 'customer' && renderCustomer()}
          {role === 'supplier' && renderSupplier()}
          {role === 'admin' && renderAdmin()}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  const bg = {
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    sky: 'bg-sky-50 text-sky-700',
    purple: 'bg-violet-50 text-violet-700',
    rose: 'bg-rose-50 text-rose-700'
  }[color] || 'bg-gray-50 text-gray-700';

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`rounded-xl p-2 ${bg}`}>{icon}</div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}
