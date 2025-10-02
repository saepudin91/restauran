// src/components/ProductCard.tsx
'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext'; // Dari Context yang sudah kita buat
import { Product } from '@/lib/types'; // Dari tipe data yang sudah kita definisikan

// Asumsi: Anda menggunakan komponen UI dasar atau shadcn/ui untuk Button
// Jika Anda tidak menggunakan shadcn/ui, ganti 'Button' dengan elemen 'button' HTML biasa
// import { Button } from './ui/button'; 

// Catatan: Interface Product bisa dipindahkan ke src/lib/types.ts untuk konsistensi.
// Kami menggunakan image_url (snake_case) sesuai dengan Supabase.

export default function ProductCard({ product }: { product: Product }) {
    // Hook untuk mengelola keranjang
    const { addToCart } = useCart();

    // Format harga ke Rupiah
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(product.price);

    const handleAddToCart = () => {
        addToCart(product);
        console.log(`[Cart] Added: ${product.name}`);
    };

    return (
        <div className="border rounded-xl shadow-lg overflow-hidden bg-white flex flex-col">

            {/* 1. Bagian Gambar */}
            <div className="relative h-48 w-full">
                <img
                    // Tambahkan timestamp (t) ke URL. Ini akan melewati cache Next.js/browser.
                    // src={`${product.image_url}?t=${new Date(product.created_at).getTime()}`}
                    src={product.image_url} // <--- Ganti dengan URL yang bersih
                    alt={product.name}
                    // fill
                    // unoptimized // <--- Pertahankan unoptimized
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                //priority
                />
            </div>
            {/* 2. Detail Produk */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 h-10 overflow-hidden mt-1 mb-3 flex-grow">{product.description}</p>

                {/* 3. Harga */}
                <p className="text-2xl font-extrabold text-blue-600 my-3">{formattedPrice}</p>

                {/* 4. Tombol Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    className="w-full py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors mt-auto"
                >
                    Tambah ke Keranjang
                </button>
            </div>
        </div>
    );
}