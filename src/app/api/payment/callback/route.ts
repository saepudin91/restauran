// src/app/api/payment/callback/route.ts

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST(request: Request) {
    // Di real project, ini akan menerima JSON dari Midtrans/Xendit
    const notification = await request.json();

    // Asumsi: Kita mendapatkan orderId dan status (SUCCESS)
    const orderId = notification.order_id || notification.id; // Gunakan id atau order_id dari payload
    const transactionStatus = notification.transaction_status || 'SUCCESS'; // Simulasi sukses

    let newStatus = 'PENDING';

    if (transactionStatus === 'SUCCESS' || transactionStatus === 'settlement' || transactionStatus === 'capture') {
        newStatus = 'SUCCESS';
    } else if (transactionStatus === 'FAILED' || transactionStatus === 'expire' || transactionStatus === 'cancel') {
        newStatus = 'FAILED';
    }

    if (newStatus !== 'PENDING') {
        const { error } = await supabaseServer
            .from('orders')
            .update({
                payment_status: newStatus,
                // Tambahkan waktu konfirmasi
                confirmed_at: new Date().toISOString()
            })
            .eq('id', orderId);

        if (error) {
            console.error('Supabase Update Error:', error);
            return NextResponse.json({ message: 'Supabase update failed' }, { status: 500 });
        }
    }

    // Response 200 ke payment gateway
    return NextResponse.json({ message: 'Callback processed successfully' }, { status: 200 });
}