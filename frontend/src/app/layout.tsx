import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import {ScreenSizeProvider} from "@/app/context/ScreenSizeContext";
import theme from "../theme";

// Font
const inter = Inter({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

// UI components
import Navbar from "@/app/ui/layout/Navbar";
import Footer from "@/app/ui/layout/Footer";

export const metadata: Metadata = {
    title: "Illinois NRS Dashboard",
    description:
    "Dashboard Representation (SPA) of the Illinois Nutrient Loss Reduction Strategy Biennial Report",
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.variable}>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <ScreenSizeProvider>
                            <Navbar />
                            {children}
                            <Footer />
                        </ScreenSizeProvider>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
