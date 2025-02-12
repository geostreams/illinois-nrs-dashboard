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
        largeText?: string;
        largeTextColor?: string;
        quoteText?: string;
    };
}

export const BaseContentSection: React.FC<BaseContentSectionProps> = ({
    textContent,
    baseImageUrl = process.env.NEXT_PUBLIC_CMS_API_URL,
    image,
    pullQuote,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const imageUrl = image?.url ? `${baseImageUrl}${image.url}` : '';

    return (
        <Box
            sx={{
                display: 'grid',
                maxWidth: '720px',
                margin: '0 auto',
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
                        gap: 2,
                        textAlign: 'center',
                        height: '100%',
                    }}
                >
                    {/* Pull Quote */}
                    {pullQuote && (
                        <PullQuote
                            largeText={pullQuote.largeText || ''}
                            largeTextColor={
                                pullQuote.largeTextColor || '#003D6D'
                            }
                            quoteText={pullQuote.quoteText || ''}
                        />
                    )}
                    {/* Image Container */}
                    {imageUrl && (
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: '400px',
                                height: 'auto',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                overflow: 'visible',
                            }}
                        >
                            <Image
                                src={imageUrl}
                                alt={image?.alternativeText || 'Content image'}
                                width={400}
                                height={150}
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};
