// src/app/api/admin/order-status/route.ts

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST(request: Request) {
    // Pastikan orderId dan newStatus dikirim dari frontend
    const { orderId, newStatus } = await request.json();

    if (!orderId || !['SUCCESS', 'FAILED'].includes(newStatus)) {
        return NextResponse.json({ message: 'Data atau status tidak valid.' }, { status: 400 });
    }

    // Melakukan UPDATE status di Supabase
    const { error } = await supabaseServer
        .from('orders')
        .update({
            payment_status: newStatus,
            confirmed_at: new Date().toISOString()
        })
        .eq('id', orderId); // Gunakan ID internal

    if (error) {
        console.error('Supabase Update Error:', error);
        return NextResponse.json({ error: 'Gagal update status di Supabase' }, { status: 500 });
    }

    return NextResponse.json({ message: `Status Order ${orderId} berhasil diubah.` }, { status: 200 });
}