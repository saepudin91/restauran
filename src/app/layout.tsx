import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/Providers';
import Header from '@/components/Header';
import Script from 'next/script'; // <-- Import Script dari next/script

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restoran App MVP",
  description: "Aplikasi Restoran Sederhana dengan Next.js dan Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 1. Tambahkan Script Midtrans di <head> atau sebelum </body> */}
      <head>
        <Script
          src={`https://app.sandbox.midtrans.com/snap/snap.js`}
          data-client-key={process.env.MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive" // Muat sebelum interaksi pengguna
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 min-h-screen`}
      >
        <Providers>
          {/* Header tetap di luar main */}
          <Header />

          <main className="bg-gray-100 pb-12">
            {children}
          </main>

        </Providers>
      </body>
    </html>
  );
}