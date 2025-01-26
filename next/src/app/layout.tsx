import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

// import components and tools
import { Navbar } from '@/components/navbar';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { Footer } from '@/components/footer';

export default async function RootLayout(props: { children: React.ReactNode }) {
    const pageData = await fetchContentType('global', ``, true);

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                style={{
                    margin: 0,
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <InitColorSchemeScript attribute="class" />
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Navbar navbar={pageData?.navbar} />
                        {/* Main content area: Grow to fill the remaining space */}
                        <main style={{ flex: 1 }}>{props.children}</main>
                        <Footer footerData={pageData?.footer} />
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
