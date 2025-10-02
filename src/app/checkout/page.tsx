// src/app/checkout/page.tsx
'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

// Deklarasi Global Window Snap (dari Midtrans Snap.js)
declare global {
    interface Window {
        snap: {
            pay: (token: string, options: any) => void;
        };
    }
}

export default function CheckoutPage() {
    const { cart, totalAmount, clearCart, removeFromCart } = useCart();
    const router = useRouter();

    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Gunakan state untuk notifikasi (menggantikan alert)
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    if (cart.length === 0) {
        return <div className="p-8 text-center text-xl text-gray-700 min-h-screen">Keranjang Anda kosong.</div>;
    }

    const formattedTotal = totalAmount.toLocaleString('id-ID');

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setNotification(null);

        if (totalAmount <= 0) {
            setNotification({ message: 'Total pembayaran harus lebih dari nol.', type: 'error' });
            return;
        }
        if (!customerName || !customerEmail) {
            setNotification({ message: 'Harap isi Nama dan Email pelanggan.', type: 'error' });
            return;
        }

        setIsLoading(true);

        try {
            // Panggilan API Route Midtrans
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cart,
                    totalAmount,
                    customerDetails: { name: customerName, email: customerEmail }
                }),
            });

            const data = await response.json();

            if (response.ok && data.snapToken) {
                // Berhasil mendapatkan Snap Token dari Midtrans

                // PANGGIL MIDTRANS SNAP POP-UP
                if (window.snap) {
                    window.snap.pay(data.snapToken, {
                        onSuccess: function (result: any) {
                            // Callback jika pembayaran sukses (di-handle oleh Webhook juga, tapi ini untuk UX)
                            clearCart();
                            router.push(`/checkout/order-success?id=${data.orderId}`);
                        },
                        onPending: function (result: any) {
                            // Callback jika pembayaran pending (menunggu transfer, dll.)
                            clearCart();
                            router.push(`/checkout/order-success?id=${data.orderId}`);
                        },
                        onError: function (result: any) {
                            setNotification({ message: 'Pembayaran gagal. Silakan coba lagi.', type: 'error' });
                        },
                        onClose: function () {
                            // User menutup pop-up
                            setNotification({ message: 'Anda menutup jendela pembayaran.', type: 'error' });
                        }
                    });
                } else {
                    setNotification({ message: 'Midtrans Snap belum dimuat. Coba refresh halaman.', type: 'error' });
                }

            } else {
                setNotification({ message: `Gagal membuat transaksi: ${data.error || 'Terjadi kesalahan Midtrans.'}`, type: 'error' });
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            setNotification({ message: 'Error jaringan. Cek konsol.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto p-8 grid md:grid-cols-3 gap-8 max-w-5xl">

                {/* Bagian Kiri (2 Kolom): Detail Pesanan */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border">
                    <h2 className="text-2xl font-extrabold text-gray-800 border-b pb-3 mb-4">Detail Pesanan Anda</h2>

                    {/* Daftar Item */}
                    <div className="space-y-4 pt-2">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <span className="font-semibold text-gray-700">{item.name} x {item.quantity}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="font-bold text-lg text-gray-800">
                                        Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                                    </span>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-700 text-xl transition-colors"
                                    >
                                        &minus;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total Bayar */}
                    <div className="mt-8 pt-4 border-t-4 border-gray-900 flex justify-between text-2xl font-bold bg-yellow-50 p-3 rounded-md">
                        <span>Total Bayar:</span>
                        <span className="text-red-600">Rp{formattedTotal}</span>
                    </div>
                </div>

                {/* Bagian Kanan (1 Kolom): Form Pelanggan & Pembayaran */}
                <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-lg border">
                    <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-3">Informasi Pelanggan</h2>

                    {/* Display Notifikasi */}
                    {notification && (
                        <div className={`p-3 mb-4 rounded-lg text-sm ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {notification.message}
                        </div>
                    )}

                    <form onSubmit={handlePayment} className="space-y-6">
                        {/* Input Nama */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        {/* Input Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Tombol Pembayaran */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 text-xl font-bold rounded-lg transition-colors shadow-md ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            {isLoading ? 'Membuat Transaksi...' : `Bayar Rp${formattedTotal} (Sandbox)`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}