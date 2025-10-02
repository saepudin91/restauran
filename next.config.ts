// next.config.js - KODE YANG SUDAH DIPERBAIKI

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ... (config options here) ...
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zcqytbnpdraxctvhvejo.supabase.co',
        // PERBAIKAN: Gunakan wildcard di akhir untuk mencakup semua file di public
        pathname: '/storage/v1/object/public/**', // Mengizinkan semua path publik
      },
    ],
  },
};

module.exports = nextConfig;