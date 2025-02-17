'use client';

import RichContentViewer from '../RichComponentViewer';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';
import PullQuote from './PullQuote';
import Typography from '@mui/material/Typography';
interface BaseContentSectionProps {
    textContent: string;
    baseImageUrl?: string;
    image?: {
        width: string;
        aspectRatio: string;
        bordered: boolean;
        image?: {
            url: string;
            alternativeText?: string | null;
            caption?: string | null;
        };
    };
    pullQuote?: {
        quoteText?: string;
    };
    quotePlacement?: 'above' | 'below';
    borderedTextBox?: boolean;
}

export const BaseContentSection: React.FC<BaseContentSectionProps> = ({
    textContent,
    baseImageUrl = process.env.NEXT_PUBLIC_CMS_API_URL,
    image,
    pullQuote,
    quotePlacement = 'above',
    borderedTextBox = false,
}) => {
    const imageUrl = image?.image?.url
        ? `${baseImageUrl}${image.image.url}`
        : '';

    return (
        <Box
            sx={{
                display: 'grid',
                maxWidth: '720px',
                my: 1,
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
            <Box
                sx={{
                    ...(borderedTextBox && {
                        borderRadius: 2,
                        border: '1px solid #0a3977',
                        boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.9)',
                        padding: 1,
                        marginBottom: 1,
                    }),
                }}
            >
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
                                flexDirection: 'column', // Stack children vertically
                                alignItems: 'flex-end', // Align items to the right
                                position: 'relative',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: image?.width || '70%',
                                    aspectRatio: image?.aspectRatio || '1/1',
                                    flexDirection: 'column',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    ...(image?.bordered && {
                                        border: '1px solid #0a3977',
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                    }),
                                }}
                            >
                                <Image
                                    src={imageUrl}
                                    alt={
                                        image?.image?.alternativeText ||
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
                            {image?.image?.caption && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        mt: 0,
                                        textAlign: 'right',
                                        width: image?.width || '70%',
                                    }}
                                >
                                    {image?.image?.caption}
                                </Typography>
                            )}
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
