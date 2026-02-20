'use client';

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { Box, Typography, Button, Popover, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import CustomInfoIcon from '@/assets/icons/CustomInfoIcon';
import { LightboxWrapper } from '../LightboxWrapper';

interface ImageWithPDFProps {
    caption: string;
    infoText?: string;
    image: {
        alternativeText?: string;
        caption?: string;
        width?: number;
        height?: number;
        url: string;
    };
    pdf: {
        name: string;
        url: string;
    };
    baseImageUrl?: string;
    imageWidth?: number;
    bordered?: boolean;
}

export const ImageWithPDF: React.FC<ImageWithPDFProps> = ({
    caption,
    infoText,
    image,
    pdf,
    baseImageUrl = process.env.CMS_API_URL,
    imageWidth = 75,
    bordered = false,
}) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const imageUrl = image.url ? `${baseImageUrl}${image.url}` : '';

    // Parse caption - everything before colon is bold
    let boldCaption = '';
    let regularCaption = '';

    if (caption) {
        const captionParts = caption.split(':');
        if (captionParts.length === 2) {
            boldCaption = captionParts[0];
            regularCaption = captionParts[1];
        } else {
            regularCaption = caption;
        }
    }

    const blackCaption = image.caption ? image.caption : null;

    // Default dimensions if not provided
    const defaultWidth = 1200;
    const defaultHeight = 800;

    const handleInfoClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleInfoClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const handlePDFDownload = useCallback(async () => {
        if (!pdf?.url) return;

        setIsLoading(true);
        try {
            const pdfUrl = pdf.url.startsWith('http') ? pdf.url : `${baseImageUrl}${pdf.url}`;

            const response = await fetch(pdfUrl);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = pdf.name || 'document.pdf';
            link.click();
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        } finally {
            setIsLoading(false);
        }
    }, [pdf?.url, pdf?.name, baseImageUrl]);

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
                        maxWidth: { xs: '100%' },
                        marginBottom: 1,
                    }}
                >
                    {boldCaption && <strong>{boldCaption}:</strong>}
                    {regularCaption}
                </Typography>
            )}

            <Box
                sx={{
                    width: { xs: '100%', sm: `${imageWidth}%` },
                    position: 'relative',
                    aspectRatio:
                        image.width && image.height
                            ? `${image.width}/${image.height}`
                            : `${defaultWidth}/${defaultHeight}`,
                    overflow: 'hidden',
                    cursor: 'pointer',
                }}
                onClick={() => setIsLightboxOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsLightboxOpen(true);
                    }
                }}
                tabIndex={0}
            >
                <Image
                    src={imageUrl}
                    alt={image.alternativeText || ''}
                    fill
                    style={{
                        objectFit: 'contain',
                        borderRadius: bordered ? '5px' : '0',
                        border: bordered ? '1px solid gray' : 'none',
                    }}
                    sizes={`(max-width: 768px) 100vw, ${imageWidth}vw`}
                    priority={false}
                    quality={75}
                />
            </Box>

            {blackCaption && (
                <Typography
                    sx={{
                        fontSize: '14px',
                        color: 'black',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        marginTop: 1,
                    }}
                >
                    {blackCaption}
                </Typography>
            )}

            {/* Controls */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 1,
                    alignItems: { xs: 'stretch', sm: 'center' },
                    mt: 2,
                    width: { xs: '100%', sm: 'auto' },
                }}
            >
                {infoText && (
                    <>
                        <IconButton
                            color="primary"
                            size="small"
                            onClick={handleInfoClick}
                            aria-label="Additional information"
                            sx={{
                                alignSelf: {
                                    xs: 'flex-start',
                                    sm: 'center',
                                },
                            }}
                        >
                            <CustomInfoIcon fontSize="small" titleAccess="Additional information" />
                        </IconButton>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleInfoClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    p: 2,
                                    maxWidth: 350,
                                    position: 'relative',
                                }}
                            >
                                <IconButton
                                    size="small"
                                    onClick={handleInfoClose}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                    }}
                                    aria-label="Close additional information"
                                >
                                    <CloseIcon fontSize="small" titleAccess="Close" />
                                </IconButton>
                                <Typography sx={{ pr: 3 }}>{infoText}</Typography>
                            </Box>
                        </Popover>
                    </>
                )}

                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon titleAccess="Download PDF" />}
                    onClick={handlePDFDownload}
                    disabled={isLoading || !pdf?.url}
                    size="small"
                    sx={{
                        minWidth: 150,
                        width: { xs: '100%', sm: 'auto' },
                    }}
                >
                    {isLoading ? 'Downloading...' : 'Download PDF'}
                </Button>
            </Box>

            {/* Lightbox */}
            {image && (
                <LightboxWrapper isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} image={image} />
            )}
        </Box>
    );
};
