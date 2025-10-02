// src/app/admin/add-product/api/route.ts

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { randomUUID } from 'node:crypto';
import { processImageWithAI } from '@/lib/aiOrchestration';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('productImage') as File | null;

        if (!file || file.size === 0) {
            return NextResponse.json({ error: 'Tidak ada file gambar yang diunggah.' }, { status: 400 });
        }

        // 1. UPLOAD FILE
        const fileExtension = file.name.split('.').pop();
        const fileName = `${randomUUID()}.${fileExtension}`;
        const filePath = fileName;

        const { error: uploadError } = await supabaseServer.storage
            .from('product-images')
            .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) {
            return NextResponse.json({ error: `Gagal mengunggah file ke Supabase: ${uploadError.message}` }, { status: 500 });
        }

        // 2. BUILD PUBLIC URL SECARA MANUAL DAN PAKSA (SOLUSI URL PERMANEN)
        // Kita tidak boleh menggunakan Signed URL (yang memiliki ?token=...)
        const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

        if (!SUPABASE_URL) {
            throw new Error("NEXT_PUBLIC_SUPABASE_URL tidak ditemukan di environment variables.");
        }

        // Hapus trailing slash (/) dari URL jika ada
        const sanitized_url = SUPABASE_URL.replace(/\/$/, '');

        // Format URL Publik yang valid: URL_DASAR/storage/v1/object/public/BUCKET/FILEPATH
        const image_url = `${sanitized_url}/storage/v1/object/public/product-images/${filePath}`;

        // 3. TRIGGER AI
        const aiData = await processImageWithAI(image_url);

        // 4. SIMPAN DATA OTOMATIS KE SUPABASE DATABASE
        const { data: dbData, error: dbError } = await supabaseServer
            .from('products')
            .insert({
                name: aiData.name,
                description: aiData.description,
                price: aiData.price,
                image_url: image_url, // <-- URL PUBLIK PERMANEN DISIMPAN DI SINI
            })
            .select('id, name, description, price')
            .single();

        if (dbError) {
            return NextResponse.json({ error: `Gagal menyimpan data ke database: ${dbError.message}` }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Produk berhasil ditambahkan melalui AI dan disimpan.',
            product: dbData
        }, { status: 201 });

    } catch (error) {
        console.error('Admin API Error:', error);
        return NextResponse.json({ error: (error as Error).message || 'Terjadi kesalahan server yang tidak terduga.' }, { status: 500 });
    }
}