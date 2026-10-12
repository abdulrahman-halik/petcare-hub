'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axiosConfig';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileRoleBanner from '@/components/profile/ProfileRoleBanner';

export default function ProfilePage() {
    const { user, setUser, logout, loading } = useAuth();
    const router = useRouter();
    const [petsCount, setPetsCount] = useState(0);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user?.role === 'customer') {
            axios.get('/pets')
                .then(res => setPetsCount(res.data.data.pets?.length || 0))
                .catch(() => setPetsCount(0));
        }
    }, [user?.role]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-3xl animate-bounce">🐾</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-8">
            <ProfileRoleBanner role={user.role} petsCount={petsCount} />

            <ProfileForm
                key={user._id || user.email}
                user={user}
                onUpdated={(updatedUser) => setUser(updatedUser)}
                onSignOut={logout}
            />
        </div>
    );
}
