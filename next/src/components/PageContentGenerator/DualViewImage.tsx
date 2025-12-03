'use client';

import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { LightboxWrapper } from '../LightboxWrapper';

interface ImageData {
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
}

interface DualViewImageProps {
    DesktopView: ImageData;
    MobileView: ImageData;
    caption: string;
    baseImageUrl?: string;
}

export const DualViewImage: React.FC<DualViewImageProps> = ({
    DesktopView,
    MobileView,
    caption,
    baseImageUrl = process.env.CMS_API_URL,
}) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [activeImage, setActiveImage] = useState<ImageData | null>(null);

    const desktopImageUrl = DesktopView?.url ? `${baseImageUrl}${DesktopView.url}` : '';
    const mobileImageUrl = MobileView?.url ? `${baseImageUrl}${MobileView.url}` : '';

    const handleOpenLightbox = (image: ImageData) => {
        setActiveImage(image);
        setIsLightboxOpen(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent, image: ImageData) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleOpenLightbox(image);
        }
    };

    // Parse caption - everything before colon is bold
    let boldCaption = '';
    let regularCaption = '';

    if (caption) {
        const colonIndex = caption.indexOf(':');
        if (colonIndex !== -1) {
            boldCaption = caption.substring(0, colonIndex);
            regularCaption = caption.substring(colonIndex + 1);
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
                marginTop: 2,
                marginBottom: 3,
                position: 'relative',
                height: 'auto',
            }}
        >
            {caption && (
                <Typography
                    sx={{
                        fontSize: '16px',
                        color: '#0A3977',
                        textAlign: 'left',
                        fontStyle: 'italic',
                        maxWidth: '100%',
                    }}
                >
                    {boldCaption && <strong>{boldCaption}:</strong>}
                    {regularCaption}
                </Typography>
            )}

            {/* Desktop View - Hidden on mobile (xs), visible on sm and up */}
            <Box
                tabIndex={0}
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    width: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                }}
                onClick={() => handleOpenLightbox(DesktopView)}
                onKeyDown={(e) => handleKeyDown(e, DesktopView)}
            >
                <div
                    style={{
                        width: '100%',
                        position: 'relative',
                        aspectRatio:
                            DesktopView?.width && DesktopView?.height
                                ? `${DesktopView.width}/${DesktopView.height}`
                                : `${defaultWidth}/${defaultHeight}`,
                        overflow: 'hidden',
                    }}
                >
                    {desktopImageUrl && (
                        <Image
                            src={desktopImageUrl}
                            alt={DesktopView?.alternativeText || caption || ''}
                            fill
                            style={{
                                objectFit: 'contain',
                            }}
                            sizes="100vw"
                            priority={false}
                            quality={75}
                        />
                    )}
                </div>
                {DesktopView?.caption && (
                    <Typography
                        sx={{
                            fontSize: '14px',
                            color: 'gray',
                            textAlign: 'left',
                            fontWeight: 'bold',
                        }}
                    >
                        {DesktopView.caption}
                    </Typography>
                )}
            </Box>

            {/* Mobile View - Visible on mobile (xs), hidden on sm and up */}
            <Box
                tabIndex={0}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    width: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                }}
                onClick={() => handleOpenLightbox(MobileView)}
                onKeyDown={(e) => handleKeyDown(e, MobileView)}
            >
                <div
                    style={{
                        width: '100%',
                        position: 'relative',
                        aspectRatio:
                            MobileView?.width && MobileView?.height
                                ? `${MobileView.width}/${MobileView.height}`
                                : `${defaultWidth}/${defaultHeight}`,
                        overflow: 'hidden',
                    }}
                >
                    {mobileImageUrl && (
                        <Image
                            src={mobileImageUrl}
                            alt={MobileView?.alternativeText || caption || ''}
                            fill
                            style={{
                                objectFit: 'contain',
                            }}
                            sizes="100vw"
                            priority={false}
                            quality={75}
                        />
                    )}
                </div>
                {MobileView?.caption && (
                    <Typography
                        sx={{
                            fontSize: '14px',
                            color: 'gray',
                            textAlign: 'left',
                            fontWeight: 'bold',
                        }}
                    >
                        {MobileView.caption}
                    </Typography>
                )}
            </Box>

            {activeImage && (
                <LightboxWrapper
                    isOpen={isLightboxOpen}
                    onClose={() => {
                        setIsLightboxOpen(false);
                        setActiveImage(null);
                    }}
                    image={activeImage}
                />
            )}
        </Box>
    );
};
