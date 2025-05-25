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
}

export const FullSpanImage: React.FC<FullSpanImageProps> = ({
    image,
    caption,
    baseImageUrl = process.env.CMS_API_URL,
    imageWidth = 75,
}) => {
    const imageUrl = image.url ? `${baseImageUrl}${image.url}` : '';
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Parse caption - everything before colon is bold
    let boldCaption = '';
    let regularCaption = '';

    // Break caption along colon, everything before colon is bold
    if (caption) {
        const captionParts = caption.split(':');
        if (captionParts.length == 2) {
            boldCaption = captionParts[0];
            regularCaption = captionParts[1];
        } else {
            regularCaption = caption;
        }
    }

    // Default dimensions if not provided
    const defaultWidth = 1200;
    const defaultHeight = 800;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                my: 2,
                position: 'relative',
                height: 'auto',
                cursor: 'pointer',
            }}
            onClick={() => setIsLightboxOpen(true)}
        >
            <div
                style={{
                    width: `${imageWidth}%`,
                    position: 'relative',
                    aspectRatio:
                        image.width && image.height
                            ? `${image.width}/${image.height}`
                            : `${defaultWidth}/${defaultHeight}`,
                }}
            >
                <Image
                    src={imageUrl}
                    alt={image.alternativeText || ''}
                    fill
                    style={{
                        objectFit: 'contain',
                    }}
                    sizes={`(max-width: 768px) 100vw, ${imageWidth}vw`}
                    priority={false}
                    quality={75}
                />
            </div>
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
            {image && (
                <LightboxWrapper isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} image={image} />
            )}
        </Box>
    );
};
