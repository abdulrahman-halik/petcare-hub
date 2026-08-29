'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from '@/lib/axiosConfig';
import { Bell, CheckCheck, ArrowLeft } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/notifications');
      setNotifications(data.data.notifications || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await axios.patch('/notifications/mark-all-read');
      setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
    } catch (error) {
      console.error('Failed to mark notifications read:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-600 font-semibold">Inbox</p>
            <h1 className="text-3xl font-black text-gray-900">Notifications</h1>
          </div>
        </div>

        <button
          onClick={markAllRead}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all read
        </button>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-gray-600 shadow-sm">
          <Bell className="w-10 h-10 mx-auto text-emerald-600 mb-3" />
          You have no notifications yet.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification: any) => (
            <div
              key={notification._id}
              className={`p-5 rounded-2xl border shadow-sm ${notification.isRead ? 'bg-white border-gray-200' : 'bg-emerald-50 border-emerald-200'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                </div>
                {!notification.isRead && (
                  <span className="inline-flex items-center rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                    New
                  </span>
                )}
              </div>
              <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
                <span>{notification.type}</span>
                <span>{new Date(notification.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
