import fetchContentType from '@/lib/strapi/fetchContentType';
import { fetchPageSlugs } from '@/lib/strapi/fetchContentType';
import Container from '@mui/material/Container';
import { PageContentReader } from '@/components/PageContentReader';
import * as React from 'react';

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const pageData = await fetchContentType(
        'pages',
        `filters[slug][$eq]=${slug}`,
        true
    );

    const pageContents = pageData?.pageContents;

    return (
        <Container maxWidth="lg">
            <PageContentReader pageContents={pageContents} />
        </Container>
    );
}

export async function generateStaticParams() {
    const pageData = await fetchPageSlugs('pages');
    console.log(pageData);
    return pageData.map((page: { slug: string }) => {
        return {
            params: {
                slug: page.slug,
            },
        };
    });
}
