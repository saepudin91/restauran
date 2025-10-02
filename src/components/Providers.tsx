// src/components/Providers.tsx
'use client';

import { CartProvider } from '@/context/CartContext';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        // Di sini Anda bisa menambahkan provider lain di masa depan
        <CartProvider>
            {children}
        </CartProvider>
    );
}