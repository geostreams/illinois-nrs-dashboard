import * as React from 'react';
import Container from '@mui/material/Container';

import fetchContentType from '@/lib/strapi/fetchContentType';
import { PageContentGenerator } from '@/components/PageContentGenerator';

export default async function About() {
    let pageData = null;
    try {
        pageData = await fetchContentType('test', ``, true);
    } catch (error) {
        console.error('Error fetching page data:', error);
    }

    const pageContents = pageData?.pageContents;
    if (!pageContents) {
        return <></>;
    }

    return (
        <Container maxWidth="lg">
            <PageContentGenerator pageContents={pageContents} />
        </Container>
    );
}
