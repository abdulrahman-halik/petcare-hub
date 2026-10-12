'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axiosConfig';
import {
  Bell,
  Package,
  PawPrint,
  Sparkles
} from 'lucide-react';

interface RecentOrder {
  _id: string;
  createdAt: string;
  total?: number;
}

interface RecommendationItem {
  _id?: string;
  product?: {
    _id?: string;
    name?: string;
  };
  primaryReason?: string;
  relevanceScore?: number;
}

interface DashboardData {
  stats?: {
    petCount?: number;
    activeReminders?: number;
    recentOrders?: number;
    recommendedProducts?: number;
  };
  recentOrders?: RecentOrder[];
  recommendations?: RecommendationItem[];
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.replace('/admin');
        return;
      }
      if (user.role === 'supplier') {
        router.replace('/supplier');
        return;
      }

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
  }, [loading, user, router]);

  if (loading || !user || user.role === 'admin' || user.role === 'supplier') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  const renderCustomer = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Pets" value={dashboard?.stats?.petCount ?? 0} icon={<PawPrint className="w-5 h-5" />} color="emerald" />
        <StatCard label="Active Reminders" value={dashboard?.stats?.activeReminders ?? 0} icon={<Bell className="w-5 h-5" />} color="amber" />
        <StatCard label="Recent Orders" value={dashboard?.stats?.recentOrders ?? 0} icon={<Package className="w-5 h-5" />} color="sky" />
        <StatCard label="Recommended" value={dashboard?.stats?.recommendedProducts ?? 0} icon={<Sparkles className="w-5 h-5" />} color="teal" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Recent orders">
          {dashboard?.recentOrders?.length ? (
            dashboard.recentOrders.map((order) => (
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
            dashboard.recommendations.map((item) => (
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">PetCare Hub</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Pet Care Dashboard
          </h1>
        </div>
        <Link href="/notifications" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs">
          <Bell className="w-3.5 h-3.5" />
          <span>Notifications</span>
        </Link>
      </div>

      {loadingData ? (
        <div className="text-gray-500 text-sm py-8 text-center">Loading dashboard metrics...</div>
      ) : (
        renderCustomer()
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  const bg = {
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    sky: 'bg-sky-50 text-sky-700',
    teal: 'bg-teal-50 text-teal-700',
    cyan: 'bg-cyan-50 text-cyan-700',
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
