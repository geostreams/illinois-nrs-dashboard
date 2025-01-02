'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    primary: {
      main: '#1976d2', // Default primary color
      light: '#42a5f5', // Light version
      dark: '#385587',  // Custom dark version
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
