// src/components/CartModal.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import React from 'react';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
    const { cart, totalAmount } = useCart();

    if (!isOpen) return null;

    // Helper untuk format harga (tetap sama)
    const formatPrice = (price: number) =>
        'Rp' + price.toLocaleString('id-ID');

    return (
        // PERBAIKAN: Mengganti bg-opacity-70 menjadi bg-opacity-50
        // Ini akan membuat latar belakang lebih transparan (abu-abu gelap)
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end transition-opacity duration-300"
            onClick={onClose}
        >

            {/* Modal Konten - (tetap sama) */}
            <div
                className="bg-white w-full max-w-sm h-full p-6 shadow-2xl overflow-y-auto transform translate-x-0 transition-transform duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ... (Konten modal lainnya tetap sama) ... */}

                <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                    <h2 className="text-2xl font-extrabold text-gray-800">Keranjang Belanja ({cart.length})</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl transition-colors">
                        &times;
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">Keranjang masih kosong 😟</p>
                        <Link href="/" onClick={onClose} className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium">
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                    <div className="flex-1 pr-4">
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">Jumlah: {item.quantity} pcs</p>
                                    </div>
                                    <span className="text-md font-bold text-gray-700">
                                        {formatPrice(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t-2 border-gray-300">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-800">Total:</span>
                                <span className="text-2xl font-extrabold text-red-600">
                                    {formatPrice(totalAmount)}
                                </span>
                            </div>
                        </div>

                        <Link href="/checkout" onClick={onClose} className="mt-6 block w-full text-center py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                            Lanjutkan ke Checkout
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}