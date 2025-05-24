import * as React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import Image from 'next/image';
import RichContentViewer from '@/components/RichComponentViewer';

export interface HeroData {
    buttonText?: string;
    buttonURL?: string;
    logoSection?: {
        url: string;
        alt?: string;
    };
    heroRightImage?: {
        url: string;
        alt?: string;
        caption?: string;
    };
    heroLeftImage?: {
        url: string;
        alt?: string;
        caption?: string;
    };
    backgroundImage?: {
        url: string;
        alt?: string;
        caption?: string;
    };
    heroText?: string;
}

export const Hero = ({
    buttonText = 'LEARN MORE',
    buttonURL = '#',
    logoSection,
    heroLeftImage,
    heroRightImage,
    backgroundImage,
    heroText,
}: HeroData) => {
    return (
        <div>
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    width: '100%',
                    height: { xs: 'auto', md: '90vh' },
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'black',
                    py: { xs: 4, md: 6 },
                    backgroundImage: backgroundImage
                        ? `url(${process.env.CMS_API_URL}${backgroundImage.url})`
                        : undefined,
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative' }}>
                    {/* Logo Section */}
                    {logoSection && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 55,
                                left: 15,
                                zIndex: 2,
                                width: 120,
                                height: 120,
                                pointerEvents: 'none',
                                display: { xs: 'none', md: 'block' },
                            }}
                        >
                            <Image
                                src={`${process.env.CMS_API_URL}${logoSection.url}`}
                                alt={logoSection.alt || 'Logo'}
                                width={120}
                                height={120}
                            />
                        </Box>
                    )}
                    <Paper
                        elevation={3}
                        sx={{
                            width: '100%',
                            p: { xs: 3, md: 5 },
                            borderRadius: 1,
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            gap: { xs: 4, md: 0 },
                            position: 'relative',
                            // Apply polygon shape only on medium screens and up
                            clipPath: {
                                xs: 'none',
                                md: 'polygon(0% 0, 100% 0, 100% 100%, 10% 100%)',
                            },
                        }}
                    >
                        {/* Content Section */}
                        <Box
                            sx={{
                                flex: { xs: '1 1 100%', md: '1 1 60%' },
                                pr: { md: 3 },
                                marginLeft: { xs: 0, md: '100px' },
                            }}
                        >
                            {/* Hero Left Image */}
                            {heroLeftImage && (
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '300px',
                                        height: '150px',
                                        mr: 'auto',
                                        ml: { xs: 'auto', md: 0 },
                                        mb: 0,
                                        overflow: 'hidden',
                                        borderRadius: '4px',
                                    }}
                                >
                                    <Image
                                        src={`${process.env.CMS_API_URL}${heroLeftImage.url}`}
                                        alt={heroLeftImage.alt || 'Illinois waterway'}
                                        fill
                                        sizes="300px"
                                        priority
                                        style={{
                                            objectFit: 'contain',
                                            objectPosition: 'left center',
                                        }}
                                    />
                                </Box>
                            )}

                            {heroText && <RichContentViewer content={heroText} />}

                            <Box
                                sx={{
                                    textAlign: { xs: 'center', md: 'left' },
                                    mt: 2,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    href={buttonURL}
                                    size="large"
                                    sx={{
                                        bgcolor: '#00507A',
                                        '&:hover': {
                                            bgcolor: '#003B5A',
                                        },
                                        px: 4,
                                        py: 1,
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        borderRadius: 0,
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {buttonText}
                                </Button>
                            </Box>
                        </Box>

                        {/* Right Image Section */}
                        {heroRightImage && (
                            <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 50%' } }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: { xs: '200px', md: '300px' },
                                    }}
                                >
                                    <Image
                                        src={`${process.env.CMS_API_URL}${heroRightImage.url}`}
                                        alt={heroRightImage.alt || 'Illinois waterway'}
                                        fill
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                        }}
                                    />
                                </Box>
                                {heroRightImage.caption && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            mt: 1,
                                            textAlign: 'left',
                                            color: '#6E6E6E',
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        {heroRightImage.caption}
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Paper>
                </Container>
            </Box>
            <Box sx={{ display: 'flex', width: '100%' }}>
                <Box sx={{ height: 4, bgcolor: '#4492bb', width: '50%' }} />
                <Box sx={{ height: 4, bgcolor: '#88B147', width: '50%' }} />
            </Box>
            <Typography
                variant="caption"
                sx={{
                    display: 'block',
                    mt: 0,
                    textAlign: 'right',
                    color: '#6E6E6E',
                    fontSize: '0.75rem',
                }}
            >
                {backgroundImage?.caption}
            </Typography>
        </div>
    );
};

export default Hero;
