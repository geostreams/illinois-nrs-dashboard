'use client';
import { createTheme } from '@mui/material/styles';
import { Source_Sans_3, Bebas_Neue } from 'next/font/google';

const sourceSansPro = Source_Sans_3({
    weight: ['400', '600'],
    subsets: ['latin'],
    display: 'swap',
});

const bebasNeue = Bebas_Neue({
    weight: ['400'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'class',
    },
    typography: {
        fontFamily: `${sourceSansPro.style.fontFamily}`,
        h1: {
            fontFamily: bebasNeue.style.fontFamily,
        },
        h2: {
            fontFamily: bebasNeue.style.fontFamily,
        },
        h3: {
            fontFamily: bebasNeue.style.fontFamily,
        },
        h4: {
            fontFamily: bebasNeue.style.fontFamily,
        },
        h5: {
            fontFamily: bebasNeue.style.fontFamily,
        },
        h6: {
            fontFamily: bebasNeue.style.fontFamily,
        },
    },
    palette: {
        primary: {
            main: '#0A3977', // Default primary color
            light: '#42a5f5', // Light version
            dark: '#385587', // Custom dark version
        },
        secondary: {
            main: '#9c27b0', // Example secondary color
        },
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                root: {
                    '&.MuiAlert-standardInfo': {
                        backgroundColor: '#60a5fa',
                    },
                },
            },
        },
    },
});

export default theme;
