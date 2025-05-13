import * as React from 'react';

import fetchContentType from '@/utils/strapi/fetchContentType';
import { notFound } from 'next/navigation';
import { PageContentGenerator } from '@/components/PageContentGenerator';

export default async function Home() {
    let pageData = null;
    try {
        pageData = await fetchContentType('home', null, true);
    } catch (error) {
        console.error('Error fetching page data:', error);
        return notFound();
    }

    const pageContents = pageData?.pageContents;

    // if pageContents is empty, return 404
    if (!pageContents) {
        return notFound();
    }

    return <PageContentGenerator pageContents={pageContents} />;
}
