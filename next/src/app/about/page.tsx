import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NextLink from 'next/link';

import fetchContentType from '@/lib/strapi/fetchContentType';
import CKReader from '@/components/ck-reader';

export default async function About() {
    const pageData = await fetchContentType('test', ``, true);

    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    Material UI - Next.js example in TypeScript
                </Typography>
                <Box sx={{ maxWidth: 'sm' }}>
                    <Button variant="contained" component={NextLink} href="/">
                        Go to the home page
                    </Button>
                </Box>
                <Box sx={{ mt: 4 }}>
                    <CKReader content={pageData?.ck_editor} />
                </Box>
            </Box>
        </Container>
    );
}
