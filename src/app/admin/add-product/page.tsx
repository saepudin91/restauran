// src/app/admin/add-product/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AiExtractedData {
    name: string;
    description: string;
    price: number;
}

export default function AddProductPage() {
    const [file, setFile] = useState<File | null>(null);
    const [aiData, setAiData] = useState<AiExtractedData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setAiData(null);
            setMessage('');
        }
    };

    // Fungsi handlePriceChange hanya akan diperlukan jika Anda ingin override harga AI.
    // Karena Anda menginginkan harga otomatis dari AI, fungsi ini tidak akan aktif.
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (aiData) {
            const rawValue = e.target.value.replace(/[^0-9]/g, '');
            const newPrice = parseInt(rawValue || '0');
            setAiData({
                ...aiData,
                price: newPrice
            });
        }
    };

    const handleProcessImage = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (!file) {
            setMessage('Pilih file gambar terlebih dahulu.');
            return;
        }

        setIsLoading(true);
        setMessage('Sedang memproses, mohon tunggu...'); // Update pesan status

        try {
            const formData = new FormData();
            formData.append('productImage', file);

            const response = await fetch('/admin/add-product/api', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.product) {
                setAiData({
                    name: data.product.name,
                    description: data.product.description,
                    price: data.product.price,
                });
                setMessage(`SUKSES! Data produk "${data.product.name}" berhasil diekstrak dan disimpan.`);
                // Setelah disimpan, kita bisa langsung refresh router jika tidak ada step override harga
                router.refresh();
                setFile(null); // Reset file input
            } else {
                setMessage(`Gagal memproses AI: ${data.error || 'Terjadi kesalahan server.'}`);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            setMessage('Error koneksi. Cek console.');
        } finally {
            setIsLoading(false);
        }
    };

    // handleSaveFinal tidak lagi diperlukan jika harga ditentukan AI dan langsung disimpan
    // Jika Anda tetap ingin tombol konfirmasi, ini bisa menjadi tombol "OK, Selesai" tanpa logik update.
    const handleConfirmSuccess = () => {
        setMessage('Produk telah berhasil ditambahkan dan ditampilkan di menu.');
        setAiData(null);
        setFile(null);
        router.refresh(); // Refresh untuk memastikan daftar produk terbaru terlihat
    };


    return (
        // Container utama untuk halaman ini
        <div className="flex justify-center items-start min-h-screen bg-gray-100 py-12"> {/* Ganti bg-gray-900 ke bg-gray-100 agar konsisten dengan layout */}
            {/* Mengatur lebar container utama menjadi lebih lebar di desktop */}
            {/* max-w-xl (kecil) -> max-w-3xl atau max-w-4xl (lebih lebar) */}
            <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-2xl text-gray-800"> {/* Ganti bg-gray-800 ke bg-white dan text-white ke text-gray-800 */}
                <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-8">Admin: Tambah Produk Otomatis (AI)</h1>

                <form onSubmit={handleProcessImage} className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm"> {/* Sesuaikan warna background dan border */}
                        <h2 className="text-xl font-semibold border-b border-gray-300 pb-3 mb-4 text-blue-600">1. Unggah Foto & Ekstrak Data</h2>

                        <div>
                            <label htmlFor="productImage" className="block text-sm font-medium text-gray-700 mb-2">Pilih Foto Produk:</label>
                            <input
                                id="productImage" // Tambahkan ID untuk label
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isLoading}
                                className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors cursor-pointer"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !file || aiData !== null}
                            className={`w-full mt-6 py-3 px-4 rounded-lg text-white font-bold text-lg transition-colors shadow-md ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {isLoading ? 'Memproses AI...' : 'Upload & Ekstrak Data Otomatis'}
                        </button>
                    </div>
                </form>

                {/* Notifikasi Message */}
                {message && (
                    <p className={`mt-6 p-4 rounded-lg font-semibold shadow-inner ${message.includes('SUKSES') ? 'bg-green-100 text-green-700 border-l-4 border-green-500' : 'bg-red-100 text-red-700 border-l-4 border-red-500'}`}>
                        {message}
                    </p>
                )}


                {/* Bagian 2: Hasil Ekstraksi AI & Tampilan */}
                {aiData && (
                    <div className="mt-8 bg-green-50 p-6 rounded-lg shadow-xl border-t-4 border-green-500"> {/* Sesuaikan warna agar lebih menarik */}
                        <h2 className="text-xl font-semibold mb-4 text-green-700">2. Hasil Ekstraksi AI (Otomatis Tersimpan)</h2>

                        <div className="space-y-4 text-gray-700">
                            <p><strong>Nama Produk:</strong> <span className="text-gray-900 font-bold">{aiData.name}</span></p>
                            <p><strong>Deskripsi:</strong> {aiData.description}</p>
                            <p><strong>Harga (AI):</strong> <span className="text-green-700 font-bold">Rp{aiData.price.toLocaleString('id-ID')}</span></p>
                        </div>

                        <button
                            onClick={handleConfirmSuccess} // Mengganti nama fungsi
                            className="w-full mt-6 py-3 px-4 rounded-lg text-white font-bold text-lg bg-green-600 hover:bg-green-700 transition-colors shadow-lg"
                        >
                            OK, Selesai!
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}