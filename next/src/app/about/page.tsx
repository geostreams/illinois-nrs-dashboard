import * as React from 'react';
import Container from '@mui/material/Container';

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
