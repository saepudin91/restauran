// src/lib/supabase.ts (Digunakan di Server Components dan API Routes)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Kunci rahasia

export const supabaseServer = createClient(supabaseUrl, supabaseKey);