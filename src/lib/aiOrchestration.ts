// src/lib/aiOrchestration.ts

import { GoogleGenAI } from '@google/genai';
// Import supabaseServer Anda dari file utamanya
import { supabaseServer } from './supabase';
import { Buffer } from 'buffer'; // Import Buffer secara eksplisit

// Inisialisasi Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Tipe data yang diharapkan
interface ExtractedData {
    name: string;
    description: string;
    price: number;
}

const responseSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', description: "Nama makanan atau minuman yang menarik." },
        description: { type: 'string', description: "Deskripsi singkat dan menggugah selera." },
        price: { type: 'number', description: "Harga jual yang wajar dalam IDR, berupa angka integer." }
    },
    required: ['name', 'description', 'price']
};

export async function processImageWithAI(imageUrl: string): Promise<ExtractedData> {
    console.log(`[Gemini] Menganalisis URL gambar: ${imageUrl}`);

    // 1. EKSTRAK PATH FILE DARI URL PUBLIK SUPABASE
    // Metode ini memastikan kita mendapatkan path file yang bersih dari URL yang panjang
    const urlParts = imageUrl.split('/storage/v1/object/public/product-images/');
    const filePath = urlParts.length > 1 ? urlParts[1] : null;

    if (!filePath) {
        throw new Error("URL Storage tidak memiliki format yang diharapkan.");
    }

    // 2. DOWNLOAD FILE DENGAN STORAGE SDK
    const { data: fileBlob, error: downloadError } = await supabaseServer.storage
        .from('product-images')
        .download(filePath);

    if (downloadError) {
        console.error('Supabase Download Error:', downloadError);
        throw new Error(`Gagal mendownload file dari Supabase: ${downloadError.message}`);
    }

    if (!fileBlob) {
        throw new Error("File Blob kosong setelah didownload dari Supabase.");
    }

    // 3. KONVERSI BLOB KE BASE64 UNTUK GEMINI
    // Menggunakan ArrayBuffer dan Buffer yang diekspor secara eksplisit
    const arrayBuffer = await fileBlob.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    const imagePart = {
        inlineData: {
            data: base64Data,
            mimeType: fileBlob.type || 'image/jpeg',
        },
    };

    const prompt = `Anda adalah ahli branding dan pemasaran. Analisis gambar produk ini, terlepas apakah itu makanan, minuman, atau produk lainnya. Tugas Anda adalah menciptakan data produk yang menarik.

INSTRUKSI WAJIB:
1.  NAMA: Berikan nama produk yang menarik dan profesional (maksimal 4 kata).
2.  DESKRIPSI: Tulis deskripsi singkat (maksimal 20 kata) yang menonjolkan fitur atau rasa utamanya.
3.  HARGA: Berikan harga jual yang wajar dalam mata uang IDR (hanya angka bulat, tanpa simbol), karena harga akan ditentukan oleh pasar.

FORMAT OUTPUT:
Sangat penting: Beri respons HANYA dalam format JSON yang valid, sesuai dengan skema output.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: [imagePart, { text: prompt }],
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.5,
            },
        });


        // **PERBAIKAN TYPE ASSERTION FINAL:** Mengatasi garis merah pada response.text
        const textResponse = (response.text as string).trim();

        if (!textResponse || !textResponse.startsWith('{')) {
            console.error("Gemini respons tidak valid atau kosong:", textResponse);
            throw new Error("Gemini gagal menghasilkan JSON yang valid.");
        }

        const extracted = JSON.parse(textResponse);
        return extracted as ExtractedData;

    } catch (error) {
        console.error('Error saat menghubungi Gemini API:', error);
        return { name: "Produk Gagal Ekstrak", description: "Error pada service AI.", price: 0 };
    }
}