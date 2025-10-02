// src/app/api/payment/route.ts

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import * as midtransClient from 'midtrans-client';
import { customAlphabet } from 'nanoid';
import { CartItem } from '@/lib/types';
// Asumsi: import * as midtransClient sudah diperbaiki dan types nanoid sudah diinstal

const nanoid = customAlphabet('1234567890abcdef', 10);

// INISIALISASI MIDTRANS CLIENT (SNAP)
const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});


export async function POST(request: Request) {
    try {
        const { cart, totalAmount, customerDetails } = await request.json() as {
            cart: CartItem[],
            totalAmount: number,
            customerDetails: { email: string, name: string }
        };

        if (totalAmount === 0 || cart.length === 0) {
            return NextResponse.json({ error: 'Keranjang kosong.' }, { status: 400 });
        }

        const orderId = `INV-${nanoid()}`;

        // --- 1. SIMPAN ORDER AWAL KE DATABASE (Tabel orders) ---
        const { data: orderData, error: orderError } = await supabaseServer
            .from('orders')
            .insert({
                order_id: orderId, // ID Midtrans
                total_amount: totalAmount,
                payment_status: 'PENDING',
                customer_name: customerDetails.name,
                customer_email: customerDetails.email,
            })
            .select('id')
            .single();

        if (orderError) {
            console.error("Supabase Order Insert Error:", orderError);
            // GAGAL DI SINI KARENA MASALAH KOLOM NOT NULL PADA TABEL ORDERS
            return NextResponse.json({ error: 'Gagal mencatat pesanan.' }, { status: 500 });
        }

        const databaseRecordId = orderData.id;

        // --- 2. SIMPAN DETAIL BARANG (Tabel order_items) ---
        const orderItems = cart.map(item => ({
            // **PERBAIKAN KRITIS:** Asumsi kolom FK Anda adalah 'order_id'
            order_id: databaseRecordId,
            product_id: item.id,
            quantity: item.quantity,
            price_at_order: item.price
        }));

        await supabaseServer.from('order_items').insert(orderItems);


        // --- 3. BUAT TRANSAKSI SNAP DI MIDTRANS ---
        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: totalAmount,
            },
            customer_details: {
                first_name: customerDetails.name,
                email: customerDetails.email,
            },
            item_details: orderItems.map(item => ({
                id: item.product_id,
                price: item.price_at_order,
                quantity: item.quantity,
                name: item.product_id, // Ganti dengan item.name jika Anda menyimpan nama produk di order_items
            })),
            callbacks: {
                finish: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/order-success?order_id=${orderId}`,
            }
        };

        const transaction = await snap.createTransaction(parameter);
        const snapToken = transaction.token;

        // --- 4. KIRIM SNAP TOKEN KE FRONTEND ---
        return NextResponse.json({
            message: 'Transaksi berhasil dibuat',
            snapToken: snapToken,
            orderId: orderId,
        }, { status: 201 });

    } catch (error) {
        console.error('Global Payment API Error:', error);
        return NextResponse.json({ error: 'Kesalahan Midtrans/Network saat membuat transaksi.' }, { status: 500 });
    }
}