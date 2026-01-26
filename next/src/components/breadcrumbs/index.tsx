import * as React from 'react';
import NextLink from 'next/link';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

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

type BreadcrumbsProps = {
    pageGroup: string;
    slug: string;
    pageTitle?: string | null;
};

export const BreadcrumbsNav = ({ pageGroup, slug, pageTitle }: BreadcrumbsProps) => {
    const groupLabel = PAGE_GROUP_LABELS[pageGroup] ?? toTitleCase(pageGroup);
    const currentLabel = pageTitle?.trim() ? pageTitle : toTitleCase(slug);
    const currentHref = `/${pageGroup}/${slug}`;

    return (
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
            <Breadcrumbs aria-label="breadcrumb" separator={<ArrowRightIcon fontSize="small" />}>
                <Link component={NextLink} underline="hover" color="primary" href="/" sx={{ fontWeight: 600 }}>
                    Home
                </Link>
                <Typography color="text.primary" sx={{ fontWeight: 200 }}>
                    {groupLabel}
                </Typography>
                <Link
                    component={NextLink}
                    underline="hover"
                    color="primary"
                    href={currentHref}
                    sx={{ fontWeight: 600 }}
                >
                    {currentLabel}
                </Link>
            </Breadcrumbs>
        </Box>
    );
};
