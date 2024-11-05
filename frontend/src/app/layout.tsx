import type { Metadata } from "next";
import "./globals.css";
import { inter } from '@/app/ui/fonts';
import Navbar from "@/app/ui/Navbar";



export const metadata: Metadata = {
  title: "Illinois NRS Dashboard",
  description: "Dashboard Representation (SPA) of the Illinois Nutrient Loss Reduction Strategy Biennial Report",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`${inter.className} antialiased`}>
    <Navbar />
    {children}
    </body>
    </html>
  );
}
