// src/components/Header.tsx
'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react'; // Import useEffect
import { useCart } from '@/context/CartContext';
import CartModal from './CartModal';

export default function Header() {
    const { totalItems } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // **SOLUSI HYDRATION ERROR:** State untuk menandakan komponen sudah mount di klien
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []); // Efek ini hanya berjalan sekali saat komponen mount di klien

    // Jika belum mounted (SSR sedang berlangsung), tampilkan nol atau null untuk menghindari mismatch
    const displayTotalItems = isMounted ? totalItems : 0;

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto p-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-gray-800">
                    Restoran App MVP
                </Link>
                <nav className="flex items-center space-x-4">

                    {/* Tombol Admin */}
                    <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-800">
                        Admin Panel
                    </Link>

                    {/* Tombol Keranjang */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="relative p-2 bg-orange-100 rounded-full hover:bg-orange-200 transition-colors"
                    >
                        🛒
                        {/* Gunakan displayTotalItems yang sudah disiapkan */}
                        {isMounted && displayTotalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {displayTotalItems}
                            </span>
                        )}
                        {/* Tampilkan 0 secara default saat SSR */}
                        {!isMounted && (
                            <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                0
                            </span>
                        )}
                    </button>
                </nav>
            </div>

            <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </header>
    );
}