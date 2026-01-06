import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { Navbar } from '@/components/navbar';
import fetchContentType from '@/utils/strapi/fetchContentType';
import { Footer } from '@/components/footer';
import { Metadata, Viewport } from 'next';
import { MainWrapper } from '@/components/MainWrapper';

export const metadata: Metadata = {
    title: 'Illinois NLRS Data Portal',
    description: 'Illinois Nutrient Loss Reduction Strategy Data Portal',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Fetch global data with proper error handling
    let pageData = null;
    try {
        pageData = await fetchContentType('global', '', true);
    } catch (error) {
        console.error('Error fetching global data:', error);
    }

    // Fallback UI for critical data loading failure
    if (!pageData) {
        return (
            <html lang="en" suppressHydrationWarning>
                <body>
                    <div
                        style={{
                            padding: '2rem',
                            textAlign: 'center',
                            fontFamily: 'system-ui, sans-serif',
                        }}
                    >
                        <h1>Loading...</h1>
                        <p>Please wait while we set up the dashboard.</p>
                    </div>
                </body>
            </html>
        );
    }

    return (
        <html lang="en" suppressHydrationWarning>
            {/* This enables that the colors in the charts are printed correctly when printing the page */}
            <head>
                <style>{`
                    @media print {
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                `}</style>
            </head>
            <body>
                <InitColorSchemeScript attribute="class" />
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: '100vh',
                                width: '100%',
                            }}
                        >
                            <Navbar
                                navbar={pageData?.navbar}
                                alertTitle="Scheduled Maintenance"
                                alertText={
                                    <>
                                        The website will be down on <strong>Tuesday, January 13th, 2026</strong>, from{' '}
                                        <strong>8:00 AM to 5:00 PM Central Time</strong> for scheduled maintenance. We
                                        apologize for any inconvenience.
                                    </>
                                }
                            />
                            <MainWrapper>{children}</MainWrapper>
                            <Footer footerData={pageData?.footer} />
                        </div>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
