// src/app/api/update-order-status/route.ts

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST(request: Request) {
    // Memastikan data yang dikirim dari frontend terbaca
    const { orderId, newStatus } = await request.json();

    if (!orderId || !['SUCCESS', 'FAILED'].includes(newStatus)) {
        return NextResponse.json({ message: 'ID Order atau Status tidak valid.' }, { status: 400 });
    }

    try {
        // Melakukan UPDATE status di Supabase
        const { error } = await supabaseServer
            .from('orders')
            .update({
                payment_status: newStatus,
                confirmed_at: new Date().toISOString()
            })
            .eq('id', orderId); // Update berdasarkan ID internal order

        if (error) {
            console.error('Supabase Update Error:', error);
            // Memberikan pesan error yang lebih jelas di konsol server
            return NextResponse.json({ error: 'Gagal update status di Supabase.' }, { status: 500 });
        }

        return NextResponse.json({ message: `Status Order ${orderId} berhasil diubah menjadi ${newStatus}.` }, { status: 200 });

    } catch (e) {
        console.error('Error server saat update status:', e);
        return NextResponse.json({ error: 'Kesalahan server saat memproses konfirmasi.' }, { status: 500 });
    }
}