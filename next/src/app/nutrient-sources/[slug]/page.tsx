import fetchContentType from '@/lib/strapi/fetchContentType';
import { fetchPageSlugs } from '@/lib/strapi/fetchContentType';
import Container from '@mui/material/Container';
import { PageContentGenerator } from '@/components/PageContentGenerator';
import * as React from 'react';
import { Sidebar } from '@/components/sidebar';
import Box from '@mui/material/Box';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    let pageData = null;
    try {
        pageData = await fetchContentType(
            'pages',
            `filters[slug][$eq]=${slug}&filters[pageGroup][$eq]=nutrient-sources`,
            true
        );
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
                    marginLeft: { xs: 0, md: '30%' },
                    marginRight: { xs: 0, md: '15%' },
                }}
            >
                <Container maxWidth="lg">
                    {/* Center the page content */}
                    <Box display="flex" justifyContent="center">
                        <PageContentGenerator pageContents={pageContents} />
                    </Box>
                </Container>
            </Box>
        </>
    );
}

export async function generateStaticParams() {
    try {
        const pageData = await fetchPageSlugs('pages', 'nutrient-sources');
        if (!pageData) return [];

        return pageData.map((page: { slug: string }) => ({
            slug: page.slug,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return []; // Return empty array if fetch fails
    }
}
