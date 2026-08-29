'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '@/lib/axiosConfig';
import { useAuth } from './AuthContext';

interface CartItem {
    product: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    subtotal: number;
}

interface CartContextType {
    cart: { items: CartItem[]; subtotal: number; tax: number; shippingFee: number; total: number } | null;
    cartCount: number;
    loading: boolean;
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState<CartContextType['cart']>(null);
    const [loading, setLoading] = useState(false);

    const refreshCart = useCallback(async () => {
        if (!user) { setCart(null); return; }
        try {
            const { data } = await axios.get('/cart');
            setCart(data.data.cart);
        } catch {
            setCart(null);
        }
    }, [user]);

    useEffect(() => { refreshCart(); }, [refreshCart]);

    const addToCart = async (productId: string, quantity = 1) => {
        await axios.post('/cart', { productId, quantity });
        await refreshCart();
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        await axios.put(`/cart/${productId}`, { quantity });
        await refreshCart();
    };

    const removeFromCart = async (productId: string) => {
        await axios.delete(`/cart/${productId}`);
        await refreshCart();
    };

    const clearCart = async () => {
        await axios.delete('/cart');
        await refreshCart();
    };

    const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return (
        <CartContext.Provider value={{ cart, cartCount, loading, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
