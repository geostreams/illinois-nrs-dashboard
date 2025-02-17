'use client';

import RichContentViewer from '../RichComponentViewer';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';
import PullQuote from './PullQuote';

interface BaseContentSectionProps {
    textContent: string;
    baseImageUrl?: string;
    image?: {
        url: string;
        alternativeText?: string | null;
    };
    pullQuote?: {
        quoteText?: string;
    };
    quotePlacement?: 'above' | 'below';
}

export const BaseContentSection: React.FC<BaseContentSectionProps> = ({
    textContent,
    baseImageUrl = process.env.NEXT_PUBLIC_CMS_API_URL,
    image,
    pullQuote,
    quotePlacement = 'above',
}) => {
    const imageUrl = image?.url ? `${baseImageUrl}${image.url}` : '';

    return (
        <Box
            sx={{
                display: 'grid',
                maxWidth: '720px',
                my: 0,
                marginRight: 0,
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: '3fr 2fr',
                    md: '3fr 2fr',
                },
                gap: 3,
                alignItems: 'center',
            }}
        >
            {/* Left column - 60% */}
            <Box>
                <RichContentViewer
                    content={textContent}
                    baseImageUrl={baseImageUrl}
                />
            </Box>

            {/* Right column - 40% */}
            {/* Conditionally render the image and pull quote */}
            {(imageUrl || pullQuote) && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center', // Centers vertically
                        alignItems: 'center', // Centers horizontally
                        textAlign: 'center',
                        height: '100%',
                    }}
                >
                    {/* Pull Quote */}
                    {pullQuote &&
                        (quotePlacement === 'above' ||
                            quotePlacement === null) && (
                            <PullQuote quoteText={pullQuote.quoteText || ''} />
                        )}
                    {/* Image Container */}
                    {imageUrl && (
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: '400px',
                                height: 'auto',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                position: 'relative',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '70%',
                                    aspectRatio: '1/1',
                                }}
                            >
                                <Image
                                    src={imageUrl}
                                    alt={
                                        image?.alternativeText ||
                                        'Content image'
                                    }
                                    fill
                                    sizes="(max-width: 768px) 100vw, 320px"
                                    style={{
                                        objectFit: 'contain',
                                    }}
                                    priority={false}
                                />
                            </Box>
                        </Box>
                    )}
                    {pullQuote && quotePlacement === 'below' && (
                        <PullQuote quoteText={pullQuote.quoteText || ''} />
                    )}
                </Box>
            )}
        </Box>
    );
};
