// src/app/admin/page.tsx
import Link from 'next/link';

export default function AdminDashboardPage() {
    return (
        <div className="p-8 bg-white shadow-xl rounded-lg">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Selamat Datang di Admin Dashboard Restoran</h1>
            <p className="text-gray-600 mb-8">
                Panel ini memungkinkan Anda mengelola menu (dengan bantuan AI) dan melacak pesanan masuk.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Card 1: Upload Produk */}
                <div className="border p-6 rounded-lg shadow-md bg-green-50">
                    <h2 className="text-xl font-bold text-green-700 mb-3">Menu Management (AI)</h2>
                    <p className="text-gray-700 mb-4">Unggah foto produk baru dan biarkan AI secara otomatis mengekstrak nama dan deskripsi.</p>
                    <Link href="/admin/add-product" className="inline-block px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                        → Tambah Produk Baru
                    </Link>
                </div>

                {/* Card 2: Daftar Pesanan */}
                <div className="border p-6 rounded-lg shadow-md bg-yellow-50">
                    <h2 className="text-xl font-bold text-yellow-700 mb-3">Lacak Pesanan Masuk</h2>
                    <p className="text-gray-700 mb-4">Lihat, verifikasi, dan konfirmasi pembayaran pesanan yang masih tertunda.</p>
                    <Link href="/admin/orders" className="inline-block px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition">
                        → Lihat Semua Pesanan
                    </Link>
                </div>

                {/* Tambahkan Card Statistik di sini jika ada data total order, dll. */}
            </div>
        </div>
    );
}