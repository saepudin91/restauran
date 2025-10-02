// src/app/admin/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClients'; // Menggunakan client browser

// Tambahkan interface Order (sesuai dengan kolom Supabase Anda)
interface Order {
    id: number | string; // Menggunakan number|string (sesuai int8 atau UUID)
    total_amount: number;
    payment_status: 'PENDING' | 'SUCCESS' | 'FAILED';
    customer_name: string;
    created_at: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        // Data fetching dilakukan sepenuhnya di sisi klien
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            setOrders(data as Order[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // FUNGSI KONFIRMASI MANUAL
    const handleConfirm = async (orderId: number | string, newStatus: 'SUCCESS' | 'FAILED') => {
        if (!confirm(`Yakin ingin mengubah status order ${orderId} menjadi ${newStatus}?`)) return;

        // **PERBAIKAN KRITIS: Memanggil API Route yang benar:**
        const response = await fetch('/api/update-order-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, newStatus }),
        });

        if (response.ok) {
            alert(`Status order ${orderId} berhasil diubah.`);
            fetchOrders(); // Reload daftar order
        } else {
            alert('Gagal mengubah status order. Cek konsol server.');
        }
    };

    if (loading) return <div className="p-8 text-center text-lg">Memuat pesanan...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Daftar Pesanan Masuk</h1>
            <button
                onClick={fetchOrders}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
            >
                Refresh Data
            </button>
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50"><tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Pembayaran</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat Pada</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                    </tr></thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className={order.payment_status === 'PENDING' ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-50'}>
                                {/* ID Order */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.id.toString().slice(0, 8)}...
                                </td>
                                {/* Pelanggan */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer_name || 'N/A'}</td>
                                {/* Total */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">Rp{order.total_amount.toLocaleString('id-ID')}</td>
                                {/* Status */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.payment_status === 'SUCCESS' ? 'bg-green-100 text-green-800' : order.payment_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                        {order.payment_status}
                                    </span>
                                </td>
                                {/* Dibuat Pada */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleTimeString()}</td>

                                {/* Kolom Tindakan */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {order.payment_status === 'PENDING' && (
                                        <button
                                            onClick={() => handleConfirm(order.id, 'SUCCESS')}
                                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs font-semibold transition shadow-md"
                                        >
                                            Konfirmasi Bayar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}