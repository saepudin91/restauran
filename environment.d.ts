// src/environment.d.ts
// Tambahkan file ini untuk memberitahu TypeScript tentang variabel ENV

declare namespace NodeJS {
    interface ProcessEnv {
        // --- SUPABASE & NEXT.JS ---
        NEXT_PUBLIC_SUPABASE_URL: string;
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
        SUPABASE_SERVICE_ROLE_KEY: string;

        // --- MIDTRANS ---
        MIDTRANS_SERVER_KEY: string;
        MIDTRANS_CLIENT_KEY: string;
        MIDTRANS_CLIENT_KEY: string;
        MIDTRANS_IS_PRODUCTION: 'true' | 'false';

        // --- GEMINI AI ---
        GEMINI_API_KEY: string;
    }
}