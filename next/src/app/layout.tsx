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

export const metadata: Metadata = {
    title: 'Illinois NLRS Data Portal',
    description: 'Illinois Nutrient Loss Reduction Strategy Data Portal',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                            <Navbar navbar={pageData?.navbar} />
                            <main
                                style={{
                                    flex: '1 1 auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    position: 'relative',
                                }}
                            >
                                {children}
                            </main>
                            <Footer footerData={pageData?.footer} />
                        </div>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
