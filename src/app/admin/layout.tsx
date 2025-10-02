// src/app/admin/layout.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';

// Asumsi: checkAuth sudah dikonfigurasi di lingkungan development
async function checkAuth() {
    if (process.env.NODE_ENV === 'development') {
        return true;
    }
    // Ganti dengan logic Supabase Auth yang sebenarnya untuk production
    return false;
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
        // Redirect ke halaman login jika tidak terautentikasi
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">

            {/* START: NAVBAR/HEADER (Mirip style Navbar Bootstrap) */}
            <header className="bg-white shadow-lg border-b border-gray-300">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">

                    <h1 className="text-2xl font-extrabold text-blue-600">
                        Restoran Admin Panel
                    </h1>

                    {/* NAVIGASI UTAMA (Inline Nav) */}
                    <nav className="flex space-x-6">
                        <Link
                            href="/admin/add-product"
                            className="text-gray-700 hover:text-blue-600 font-medium py-1 transition-colors border-b-2 border-transparent hover:border-blue-600"
                        >
                            Upload Produk (AI)
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="text-gray-700 hover:text-blue-600 font-medium py-1 transition-colors border-b-2 border-transparent hover:border-blue-600"
                        >
                            Daftar Pesanan
                        </Link>
                        <Link
                            href="/"
                            className="text-orange-500 hover:text-orange-600 font-medium py-1"
                        >
                            ← Ke Toko
                        </Link>
                    </nav>
                    {/* END NAVIGASI UTAMA */}
                </div>
            </header>

            {/* END: NAVBAR/HEADER */}

            {/* MAIN CONTENT AREA */}
            <main className="container mx-auto px-4 py-8 flex-grow">
                {children}
            </main>
        </div>
    );
}