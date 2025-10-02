// src/lib/types.ts

// Tipe data yang diambil dari tabel 'products' Supabase
export interface Product {
    id: string; // atau number, tergantung pada setup Supabase
    name: string;
    description: string;
    price: number;
    image_url: string;
    created_at: string;
}

// Tipe data item keranjang
export interface CartItem extends Product {
    quantity: number;
}