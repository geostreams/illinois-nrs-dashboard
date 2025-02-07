'use client';

import RichContentViewer from '../RichComponentViewer';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';

interface BaseContentSectionProps {
    textContent: string;
    baseImageUrl?: string;
    image?: {
        url: string;
        alternativeText?: string | null;
    };
    imagePullQuote?: string;
}

export const BaseContentSection: React.FC<BaseContentSectionProps> = ({
    textContent,
    baseImageUrl = process.env.NEXT_PUBLIC_CMS_API_URL,
    image,
    imagePullQuote,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const imageUrl = image?.url ? `${baseImageUrl}${image.url}` : '';

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
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
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    position: 'relative',
                    minHeight: '300px',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    {imagePullQuote && (
                        <Typography
                            sx={{
                                color: '#003D6D',
                                fontFamily: 'sans-serif',
                                fontWeight: 400,
                                lineHeight: 1.2,
                                fontSize: '1.5rem',
                                textAlign: 'right',
                                width: '100%',
                            }}
                        >
                            {imagePullQuote}
                        </Typography>
                    )}
                    <Box
                        sx={{
                            width: '100%',
                            height: '300px',
                            position: 'relative',
                        }}
                    >
                        {imageUrl && (
                            <Image
                                src={imageUrl}
                                alt={image?.alternativeText || 'Content image'}
                                fill
                                style={{ objectFit: 'contain' }}
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
