'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from '@/lib/axiosConfig';
import { useAuth } from './AuthContext';

export interface CartItem {
    product: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    subtotal: number;
}

export interface CartData {
    items: CartItem[];
    subtotal: number;
    tax: number;
    shippingFee: number;
    total: number;
}

interface CartContextType {
    cart: CartData | null;
    cartCount: number;
    loading: boolean;
    addToCart: (productId: string, quantity?: number, productDetails?: Partial<CartItem>) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = 'petcare_guest_cart';

const computeTotals = (items: CartItem[]): CartData => {
    const TAX_RATE = 0.10;
    const FREE_SHIPPING_THRESHOLD = 50;
    const FLAT_SHIPPING_FEE = 5;

    const subtotal = Math.round(items.reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity)), 0) * 100) / 100;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const shippingFee = items.length === 0 ? 0 : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE);
    const total = Math.round((subtotal + tax + shippingFee) * 100) / 100;

    return { items, subtotal, tax, shippingFee, total };
};

const getLocalCart = (): CartData => {
    if (typeof window === 'undefined') return { items: [], subtotal: 0, tax: 0, shippingFee: 0, total: 0 };
    try {
        const saved = localStorage.getItem(GUEST_CART_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed.items)) {
                return computeTotals(parsed.items);
            }
        }
    } catch {
        // ignore JSON errors
    }
    return { items: [], subtotal: 0, tax: 0, shippingFee: 0, total: 0 };
};

const saveLocalCart = (cartData: CartData) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartData));
    } catch {
        // ignore localStorage errors
    }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(false);
    const syncingRef = useRef(false);

    const refreshCart = useCallback(async () => {
        if (!user) {
            const local = getLocalCart();
            setCart(local);
            return;
        }

        try {
            setLoading(true);
            // If user just logged in and has local guest items, sync them first
            if (!syncingRef.current) {
                const local = getLocalCart();
                if (local.items.length > 0) {
                    syncingRef.current = true;
                    for (const item of local.items) {
                        try {
                            await axios.post('/cart', { productId: item.product, quantity: item.quantity });
                        } catch {
                            // ignore individual merge errors
                        }
                    }
                    localStorage.removeItem(GUEST_CART_KEY);
                    syncingRef.current = false;
                }
            }

            const { data } = await axios.get('/cart');
            setCart(data.data.cart);
        } catch {
            setCart({ items: [], subtotal: 0, tax: 0, shippingFee: 0, total: 0 });
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addToCart = async (productId: string, quantity = 1, productDetails?: Partial<CartItem>) => {
        if (user) {
            await axios.post('/cart', { productId, quantity });
            await refreshCart();
        } else {
            // Guest mode
            const local = getLocalCart();
            const existingIdx = local.items.findIndex(i => i.product === productId);
            let updatedItems = [...local.items];

            if (existingIdx >= 0) {
                const current = updatedItems[existingIdx];
                const newQty = current.quantity + quantity;
                updatedItems[existingIdx] = {
                    ...current,
                    quantity: newQty,
                    subtotal: Math.round(current.price * newQty * 100) / 100
                };
            } else {
                let name = productDetails?.name || 'Pet Item';
                let price = productDetails?.price || 0;
                let imageUrl = productDetails?.imageUrl || '';

                // If details missing, attempt quick fetch
                if (!productDetails?.name || productDetails?.price === undefined) {
                    try {
                        const { data } = await axios.get(`/products/${productId}`);
                        if (data.data.product) {
                            name = data.data.product.name;
                            price = data.data.product.price;
                            imageUrl = data.data.product.imageUrl || (data.data.product.images && data.data.product.images[0]) || '';
                        }
                    } catch {
                        // ignore fetch error and use defaults
                    }
                }

                updatedItems.push({
                    product: productId,
                    name,
                    price,
                    imageUrl,
                    quantity,
                    subtotal: Math.round(price * quantity * 100) / 100
                });
            }

            const newCart = computeTotals(updatedItems);
            saveLocalCart(newCart);
            setCart(newCart);
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (user) {
            await axios.put(`/cart/${productId}`, { quantity });
            await refreshCart();
        } else {
            const local = getLocalCart();
            const idx = local.items.findIndex(i => i.product === productId);
            if (idx >= 0) {
                let updatedItems = [...local.items];
                if (quantity <= 0) {
                    updatedItems = updatedItems.filter(i => i.product !== productId);
                } else {
                    const current = updatedItems[idx];
                    updatedItems[idx] = {
                        ...current,
                        quantity,
                        subtotal: Math.round(current.price * quantity * 100) / 100
                    };
                }
                const newCart = computeTotals(updatedItems);
                saveLocalCart(newCart);
                setCart(newCart);
            }
        }
    };

    const removeFromCart = async (productId: string) => {
        if (user) {
            await axios.delete(`/cart/${productId}`);
            await refreshCart();
        } else {
            const local = getLocalCart();
            const updatedItems = local.items.filter(i => i.product !== productId);
            const newCart = computeTotals(updatedItems);
            saveLocalCart(newCart);
            setCart(newCart);
        }
    };

    const clearCart = async () => {
        if (user) {
            await axios.delete('/cart');
            await refreshCart();
        } else {
            const newCart = computeTotals([]);
            saveLocalCart(newCart);
            setCart(newCart);
        }
    };

    const cartCount = cart?.items?.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) ?? 0;

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
