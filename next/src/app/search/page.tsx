'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, Suspense } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';

const PAGE_GROUP_LABELS: Record<string, string> = {
    'nutrient-sources': 'Nutrient Sources',
    'water-quality': 'Water Quality',
    overview: 'Strategy Overview',
    research: 'Research',
    partners: 'Partners',
    'learn-more': 'Nutrient Sources',
};

const toTitleCase = (value: string): string =>
    value
        .split(/[-_]/g)
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ');

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

interface SearchResponse {
    results: SearchResult[];
    total: number;
    query: string;
    error?: string;
}

function SearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q') || '';

    const [searchInput, setSearchInput] = useState(query);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setTotal(0);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
            const data: SearchResponse = await response.json();

            if (data.error) {
                setError(data.error);
                setResults([]);
                setTotal(0);
            } else {
                setResults(data.results);
                setTotal(data.total);
            }
        } catch {
            setError('Search is temporarily unavailable. Please try again later.');
            setResults([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setSearchInput(query);
        if (query) {
            performSearch(query);
        }
    }, [query, performSearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    const getSnippet = (result: SearchResult): string => {
        if (result.highlights.searchableText.length > 0) {
            return result.highlights.searchableText.join(' ... ');
        }
        if (result.excerpt) {
            return result.excerpt.length > 200 ? result.excerpt.slice(0, 200) + '...' : result.excerpt;
        }
        return '';
    };

    const getBreadcrumb = (result: SearchResult) => {
        if (result.contentType === 'home') {
            return 'Home';
        }
        const groupLabel = PAGE_GROUP_LABELS[result.pageGroup] ?? toTitleCase(result.pageGroup);
        return `Home ${'\u203A'} ${groupLabel}`;
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography
                variant="h1"
                sx={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    color: 'primary.main',
                    mb: 3,
                }}
            >
                Search Results
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search..."
                    aria-label="Search the website"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton type="submit" aria-label="Submit search">
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Typography color="error" sx={{ py: 2 }}>
                    {error}
                </Typography>
            )}

            {!loading && !error && query && (
                <Typography sx={{ mb: 3, color: 'text.secondary' }}>
                    {total} {total === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
                </Typography>
            )}

            {/* Search results */}
            {!loading &&
                !error &&
                results.map((result, index) => (
                    <Box
                        key={`${result.contentType}-${result.slug}-${index}`}
                        sx={{
                            py: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                {getBreadcrumb(result)}
                            </Typography>
                        </Box>

                        <Link href={result.urlPath} style={{ textDecoration: 'none' }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    mb: 0.5,
                                    '&:hover': { textDecoration: 'underline' },
                                    '& mark': {
                                        backgroundColor: '#FFE082',
                                        fontWeight: 700,
                                        borderRadius: '2px',
                                        px: '2px',
                                    },
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: result.highlights.title || result.title,
                                }}
                            />
                        </Link>

                        {result.highlights.headings && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    fontStyle: 'italic',
                                    mb: 0.5,
                                    '& mark': {
                                        backgroundColor: '#FFE082',
                                        fontWeight: 600,
                                        borderRadius: '2px',
                                        px: '2px',
                                    },
                                }}
                                dangerouslySetInnerHTML={{ __html: result.highlights.headings }}
                            />
                        )}

                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.primary',
                                lineHeight: 1.6,
                                '& mark': {
                                    backgroundColor: '#FFE082',
                                    fontWeight: 600,
                                    borderRadius: '2px',
                                    px: '2px',
                                },
                            }}
                            dangerouslySetInnerHTML={{ __html: getSnippet(result) }}
                        />
                    </Box>
                ))}

            {/* No results found */}
            {!loading && !error && query && results.length === 0 && (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        No results found
                    </Typography>
                    <Typography color="text.secondary">Try different keywords or check your spelling.</Typography>
                </Box>
            )}
        </Container>
    );
}

export default function SearchPage() {
    return (
        <Suspense
            fallback={
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                </Container>
            }
        >
            <SearchResults />
        </Suspense>
    );
}
