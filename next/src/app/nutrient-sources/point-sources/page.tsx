import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NextLink from 'next/link';

import fetchContentType from '@/lib/strapi/fetchContentType';
import { PageContentReader } from '@/components/PageContentReader';

export default async function About() {
    const pageData = await fetchContentType('test', ``, true);

    const pageContents = pageData?.pageContents;

    return (
        <Container maxWidth="lg">
            <PageContentReader pageContents={pageContents} />
        </Container>
    );
}
