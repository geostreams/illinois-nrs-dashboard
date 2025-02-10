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
                margin: '0 0',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: '3fr 2fr',
                    md: '3fr 2fr',
                },
                gap: 3,
                alignItems: 'start',
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
            {/* Conditionally render the image */}
            {(imageUrl || pullQuote) && (
                <Box
                    sx={{
                        height: 'fit-content',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        position: 'relative',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxHeight: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: 0,
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
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: '400px',
                                height: '150px',
                                position: 'relative',
                                overflow: 'visible',
                                objectPosition: {
                                    xs: 'center',
                                    md: 'right',
                                },
                                marginBottom: { xs: '1em', md: '0' },
                            }}
                        >
                            {imageUrl && (
                                <Image
                                    src={imageUrl}
                                    alt={
                                        image?.alternativeText ||
                                        'Content image'
                                    }
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                />
                            )}
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};
