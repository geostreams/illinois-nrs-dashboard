'use client';

import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { LightboxWrapper } from '../LightboxWrapper';

interface FullSpanImageProps {
    image: {
        url: string;
        alternativeText?: string;
        width?: number;
        height?: number;
        caption?: string;
        formats?: {
            large?: {
                url: string;
            };
            medium?: {
                url: string;
            };
        };
    };
    caption: string;
    baseImageUrl?: string;
    imageWidth?: number;
    bordered?: boolean;
}

export const FullSpanImage: React.FC<FullSpanImageProps> = ({
    image,
    caption,
    baseImageUrl = process.env.CMS_API_URL,
    imageWidth = 75,
    bordered = false,
}) => {
    const imageUrl = image.url ? `${baseImageUrl}${image.url}` : '';
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const handleOpenLightbox = () => {
        setIsLightboxOpen(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleOpenLightbox();
        }
    };

    // Parse caption - everything before colon is bold
    let boldCaption = '';
    let regularCaption = '';

    // Break caption along first colon, everything before colon is bold
    if (caption) {
        const colonIndex = caption.indexOf(':');
        if (colonIndex !== -1) {
            boldCaption = caption.substring(0, colonIndex);
            regularCaption = caption.substring(colonIndex + 1);
        } else {
            regularCaption = caption;
        }
    }

    const grayCaption = image.caption ? image.caption : null;
    // Default dimensions if not provided
    const defaultWidth = 1200;
    const defaultHeight = 800;

    return (
        <Box
            tabIndex={0}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 2,
                marginBottom: 3,
                position: 'relative',
                height: 'auto',
                cursor: 'pointer',
            }}
            onClick={handleOpenLightbox}
            onKeyDown={handleKeyDown}
        >
            {caption && (
                <Typography
                    sx={{
                        fontSize: '16px',
                        color: '#0A3977',
                        textAlign: 'left',
                        fontStyle: 'italic',
                        maxWidth: { xs: '100%', sm: `${imageWidth}%` },
                    }}
                >
                    {boldCaption && <strong>{boldCaption}:</strong>}
                    {regularCaption}
                </Typography>
            )}
            <div
                style={{
                    width: `${imageWidth}%`,
                    position: 'relative',
                    aspectRatio:
                        image.width && image.height
                            ? `${image.width}/${image.height}`
                            : `${defaultWidth}/${defaultHeight}`,
                    overflow: 'hidden',
                }}
            >
                <Image
                    src={imageUrl}
                    alt={image.alternativeText || ''}
                    fill
                    style={{
                        // objectFit: 'contain',
                        borderRadius: bordered ? '5px' : '0',
                        border: bordered ? '1px solid gray' : 'none',
                    }}
                    sizes={`(max-width: 768px) 100vw, ${imageWidth}vw`}
                    priority={false}
                    quality={75}
                />
            </div>
            {grayCaption && (
                <Typography
                    sx={{
                        fontSize: '14px',
                        color: 'gray',
                        textAlign: 'left',
                        fontWeight: 'bold',
                    }}
                >
                    {grayCaption}
                </Typography>
            )}

            {image && (
                <LightboxWrapper isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} image={image} />
            )}
        </Box>
    );
};
