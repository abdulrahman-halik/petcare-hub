'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axiosConfig';
import { getRoleDashboardPath } from '@/lib/roleNavigation';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    accountStatus?: 'active' | 'deactivated';
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterUserData {
    name: string;
    email: string;
    password: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (userData: RegisterUserData) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get('/users/profile');
                setUser(data.data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const { data } = await axios.post('/auth/login', credentials);
        const loggedUser = data.data.user;
        setUser(loggedUser);
        const destination = getRoleDashboardPath(loggedUser?.role);
        router.push(destination);
    };

    const register = async (userData: RegisterUserData) => {
        await axios.post('/auth/register', userData);
        try {
            await axios.post('/auth/logout');
        } catch {
            // ignore logout error
        }
        setUser(null);
        router.push('/login?registered=true');
    };

    const logout = async () => {
        try {
            await axios.post('/auth/logout');
        } catch {
            // ignore logout error
        }
        if (typeof window !== 'undefined') {
            window.location.replace('/');
        } else {
            setUser(null);
            router.push('/');
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
