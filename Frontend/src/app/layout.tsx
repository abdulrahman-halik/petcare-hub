import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import AppShell from '@/components/layout/AppShell';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PetCare Hub | Premium Pet Food, Supplies & Veterinary Essentials",
  description: "Discover veterinarian-approved pet food, toys, health supplements, and accessories from verified suppliers with fast delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900`}>
        <AuthProvider>
          <CartProvider>
            <AppShell>
              {children}
            </AppShell>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
