// src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/lib/types'; // Import tipe yang sudah Anda buat

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    totalItems: number;
    totalAmount: number;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = 'restoran_cart'; // Kunci unik untuk localStorage

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // 1. INISIALISASI STATE: Baca dari localStorage saat komponen dimuat
    const [cart, setCart] = useState<CartItem[]>(() => {
        // Logika hanya berjalan di sisi browser
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem(STORAGE_KEY);
            // Mengembalikan keranjang yang tersimpan atau array kosong jika belum ada
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });

    // 2. EFEK PERSISTENSI: Simpan ke localStorage setiap kali 'cart' berubah
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        }
    }, [cart]); // Efek ini akan berjalan setiap kali array 'cart' berubah

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === productId);

            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            } else {
                return prevCart.filter(item => item.id !== productId);
            }
        });
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, totalItems, totalAmount, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};