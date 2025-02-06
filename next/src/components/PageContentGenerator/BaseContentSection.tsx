'use client';

import RichContentViewer from '../RichComponentViewer';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';

interface BaseContentSectionProps {
    textContent: string;
    baseImageUrl?: string;
    image?: {
        url: string;
        alternativeText?: string | null;
    };
}

export const BaseContentSection: React.FC<BaseContentSectionProps> = ({
    textContent,
    baseImageUrl = process.env.NEXT_PUBLIC_CMS_API_URL,
    image,
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
    );
};
