// src/app/admin/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // SIMULASI: Anggap login sukses
        alert("Login Sukses (Simulasi)");

        // Redirect ke Admin Dashboard setelah login
        router.push('/admin/add-product');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
                <h1 className="text-2xl font-bold mb-6">Login Admin Restoran</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="Email Admin" className="w-full p-2 border rounded" required />
                    <input type="password" placeholder="Password" className="w-full p-2 border rounded" required />
                    <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-sm text-gray-500">
                    Ini adalah halaman login simulasi untuk demo.
                </p>
            </div>
        </div>
    );
}