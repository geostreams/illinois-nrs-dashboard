import fetchContentType from '@/lib/strapi/fetchContentType';
import { fetchPageSlugs } from '@/lib/strapi/fetchContentType';
import Container from '@mui/material/Container';
import { PageContentReader } from '@/components/PageContentReader';
import * as React from 'react';
import { Sidebar } from '@/components/sidebar';
import Box from '@mui/material/Box';

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const pageData = await fetchContentType(
        'pages',
        `filters[slug][$eq]=${slug}`,
        true
    );

    const pageContents = pageData?.pageContents;

    return (
        <>
            <Box
                sx={{
                    flex: 1,
                    display: { xs: 'none', md: 'block' },
                }}
            >
                <Sidebar />
            </Box>
            <Box
                sx={{
                    flex: 1,
                    p: 3,
                    marginLeft: { xs: 0, md: '240px' },
                }}
            >
                <Container maxWidth="lg">
                    <PageContentReader pageContents={pageContents} />
                </Container>
            </Box>
        </>
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
