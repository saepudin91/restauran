// src/app/checkout/order-success/page.tsx
// Ini adalah Server Component (default)

import Link from 'next/link';

export default function OrderSuccessPage({ searchParams }: { searchParams: { id?: string } }) {
    const orderId = searchParams.id || 'N/A';

    return (
        <div className="container mx-auto p-12 text-center min-h-screen flex flex-col justify-center items-center">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h1 className="text-3xl font-bold mt-4 text-gray-900">Pembayaran Berhasil!</h1>
            <p className="mt-2 text-gray-600">Terima kasih atas pesanan Anda. Order Anda akan segera diproses.</p>

            <p className="mt-4 text-lg font-semibold">Nomor Pesanan Anda:</p>
            <p className="text-2xl font-extrabold text-blue-600">{orderId}</p>

            <div className="mt-8">
                <Link href="/" className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                    Kembali ke Menu Utama
                </Link>
            </div>
        </div>
    );
}