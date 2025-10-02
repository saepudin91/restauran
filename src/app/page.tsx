// src/app/page.tsx

import { supabaseServer } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';

// Hapus semua kode boilerplate dan gantikan dengan ini:

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabaseServer
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data as Product[];
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="container mx-auto p-4 min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Menu Pilihan Restoran</h1>

      {/* PERUBAHAN KRITIS DI SINI: Menambah kolom untuk tampilan lebih kecil */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}