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
        boldCaption = captionParts[0];
        regularCaption = captionParts[1];
    }
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
                    width: '100%',
                    height: 'auto',
                    position: 'relative',
                    textAlign: 'left',
                }}
            >
                <img
                    src={imageUrl}
                    alt={image.alternativeText}
                    style={{
                        objectFit: 'contain',
                        width: `${imageWidth}%`,
                        height: 'auto',
                        maxWidth: '100%', // Ensure image doesn't overflow on mobile
                    }}
                />
            </div>
            {caption && (
                <Typography
                    sx={{
                        fontSize: '16px',
                        color: '#0A3977',
                        textAlign: 'left',
                        fontStyle: 'italic',
                        maxWidth: { xs: '100%', sm: `${imageWidth}%` }, // Adjust caption width on mobile
                    }}
                >
                    <strong>{boldCaption}:</strong>
                    {regularCaption}
                </Typography>
            )}
            {image && (
                <LightboxWrapper
                    isOpen={isLightboxOpen}
                    onClose={() => setIsLightboxOpen(false)}
                    image={image}
                />
            )}
        </Box>
    );
};
