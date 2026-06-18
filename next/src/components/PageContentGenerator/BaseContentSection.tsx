'use client';

import { useState } from 'react';
import RichContentViewer from '../RichComponentViewer';
import Box from '@mui/material/Box';
import Image from 'next/image';
import PullQuote from './PullQuote';
import Typography from '@mui/material/Typography';
import { LightboxWrapper } from '../LightboxWrapper';

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
            formats?: {
                large: {
                    url: string;
                };
                medium: {
                    url: string;
                };
            };
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
    baseImageUrl = process.env.CMS_URL,
    image,
    pullQuote,
    quotePlacement = 'above',
    borderedTextBox = false,
}) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const imageUrl = image?.image?.url ? `${baseImageUrl}${image.image.url}` : '';

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                maxWidth: borderedTextBox
                    ? {
                          xs: '100%',
                          sm: '90%',
                          md: '75%',
                          lg: '55%',
                      }
                    : '100%',
                my: 1,
                gap: 3,
                alignItems: 'flex-start',
            }}
        >
            {/* Main content - grows to fill available space */}
            <Box
                sx={{
                    flex: '1 1 auto',
                    width: '100%',
                    maxWidth: imageUrl || pullQuote || borderedTextBox ? { xs: '100%', sm: '66.67%' } : '100%',
                    ...(borderedTextBox && {
                        borderRadius: '4px',
                        border: '1px solid #0a3977',
                        boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.9)',
                        padding: '15px 25px 15px 15px',
                        mb: 3,
                        mt: '5px',
                    }),
                }}
            >
                <RichContentViewer content={textContent} baseImageUrl={baseImageUrl} />
            </Box>

            {/* Side content - fixed width */}
            {(imageUrl || pullQuote) && (
                <Box
                    sx={{
                        flex: '0 0 auto',
                        width: { xs: '100%', sm: '33.33%' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    {/* Pull Quote */}
                    {pullQuote && (quotePlacement === 'above' || quotePlacement === null) && (
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
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: image?.width || '70%',
                                    aspectRatio: image?.aspectRatio || '1/1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    ...(image?.bordered && {
                                        border: '1.5px solid #0a3977',
                                        borderRadius: '4px',
                                        padding: '2px',
                                        backgroundColor: 'background.paper',
                                    }),
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
                                    alt={image?.image?.alternativeText || 'Content image'}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 320px"
                                    style={{
                                        objectFit: image?.bordered ? 'cover' : 'contain',
                                        borderRadius: image?.bordered ? '4px' : '0',
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
                    {pullQuote && quotePlacement === 'below' && <PullQuote quoteText={pullQuote.quoteText || ''} />}
                </Box>
            )}
            {image?.image && (
                <LightboxWrapper isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} image={image.image} />
            )}
        </Box>
    );
};
