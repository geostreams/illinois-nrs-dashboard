import { Client } from '@elastic/elasticsearch';
import { NextRequest, NextResponse } from 'next/server';

const INDEX_NAME = 'ilnlrs-content';

const client = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

interface SearchResult {
    title: string;
    slug: string;
    pageGroup: string;
    urlPath: string;
    excerpt: string;
    contentType: string;
    score: number;
    highlights: {
        title: string | null;
        searchableText: string[];
        headings: string | null;
    };
}

interface EsSource {
    title: string;
    slug: string;
    pageGroup: string;
    urlPath: string;
    excerpt: string;
    contentType: string;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
        return NextResponse.json({ results: [], total: 0, query: '' });
    }

    const trimmedQuery = query.trim();

    try {
        const response = await client.search<EsSource>({
            index: INDEX_NAME,
            query: {
                multi_match: {
                    query: trimmedQuery,
                    fields: ['title^3', 'headings^2', 'searchableText', 'excerpt'],
                    type: 'best_fields',
                    fuzziness: 'AUTO',
                    prefix_length: 3,
                },
            },
            highlight: {
                fields: {
                    searchableText: {
                        fragment_size: 200,
                        number_of_fragments: 2,
                        pre_tags: ['<mark>'],
                        post_tags: ['</mark>'],
                    },
                    title: {
                        number_of_fragments: 0,
                        pre_tags: ['<mark>'],
                        post_tags: ['</mark>'],
                    },
                    headings: {
                        fragment_size: 150,
                        number_of_fragments: 1,
                        pre_tags: ['<mark>'],
                        post_tags: ['</mark>'],
                    },
                },
            },
            _source: ['title', 'slug', 'pageGroup', 'urlPath', 'excerpt', 'contentType'],
            size: 20,
        });

        const results: SearchResult[] = response.hits.hits.map((hit) => ({
            title: hit._source!.title,
            slug: hit._source!.slug,
            pageGroup: hit._source!.pageGroup,
            urlPath: hit._source!.urlPath,
            excerpt: hit._source!.excerpt,
            contentType: hit._source!.contentType,
            score: hit._score ?? 0,
            highlights: {
                title: hit.highlight?.title?.[0] ?? null,
                searchableText: hit.highlight?.searchableText ?? [],
                headings: hit.highlight?.headings?.[0] ?? null,
            },
        }));

        const total = typeof response.hits.total === 'number' ? response.hits.total : (response.hits.total?.value ?? 0);

        return NextResponse.json({ results, total, query: trimmedQuery });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            { results: [], total: 0, query: trimmedQuery, error: 'Search service error' },
            { status: 500 }
        );
    }
}
