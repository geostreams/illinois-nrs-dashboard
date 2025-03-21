import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import fetchContentType from '@/utils/strapi/fetchContentType';
import { notFound } from 'next/navigation';
import { PageContentGenerator } from '@/components/PageContentGenerator';

export default async function Home() {
    let pageData = null;
    try {
        pageData = await fetchContentType('home', '', true);
    } catch (error) {
        console.error('Error fetching page data:', error);
        return notFound();
    }

    const pageContents = pageData?.pageContents;

    // if pageContents is empty, return 404
    if (!pageContents) {
        return notFound();
    }

    return (
        <Container maxWidth="lg">
            <PageContentGenerator pageContents={pageContents} />
        </Container>
    );
}
