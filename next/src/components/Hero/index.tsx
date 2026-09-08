import * as React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
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
    backgroundImage?: {
        url: string;
        alt?: string;
        caption?: string;
    };
    heroText?: string;
}

export const Hero = ({
    // buttonText = 'LEARN MORE',
    // buttonURL = '#',
    logoSection,
    heroRightImage,
    backgroundImage,
    heroText,
}: HeroData) => {
    const heroShapePath =
        'M1 0 H99 A1 1 0 0 1 100 1 V99 A1 1 0 0 1 99 100 H5.75 A1 1 0 0 1 4.705 99.002 L0.025 0.998 A1 1 0 0 1 1 0 Z';

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
                    backgroundImage: backgroundImage ? `url(${process.env.CMS_URL}${backgroundImage.url})` : undefined,
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
                                top: 64,
                                left: 15,
                                zIndex: 2,
                                width: 120,
                                height: 120,
                                pointerEvents: 'none',
                                display: { xs: 'none', md: 'block' },
                            }}
                        >
                            <Image
                                src={`${process.env.CMS_URL}${logoSection.url}`}
                                alt={logoSection.alt || 'Logo'}
                                width={138}
                                height={138}
                            />
                        </Box>
                    )}
                    <Paper
                        elevation={3}
                        sx={{
                            width: '100%',
                            p: { xs: 4, md: 6 },
                            borderRadius: 1,
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            gap: { xs: 4, md: 2 },
                            position: 'relative',
                            backgroundColor: { xs: 'background.paper', md: 'transparent' },
                            boxShadow: { xs: 3, md: 'none' },
                        }}
                    >
                        <Box
                            component="svg"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                            sx={{
                                display: { xs: 'none', md: 'block' },
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none',
                                zIndex: 0,
                            }}
                        >
                            <path d={heroShapePath} fill="#fff" />
                        </Box>
                        {/* Content Section */}
                        <Box
                            sx={{
                                position: 'relative',
                                zIndex: 1,
                                flex: { xs: '1 1 100%', md: '1 1 60%' },
                                pr: { md: 6 },
                                marginLeft: { xs: 0, md: '100px' },
                            }}
                        >
                            <Box component="h1" tabIndex={0} sx={{ mb: 2, textAlign: { xs: 'center', md: 'left' } }}>
                                <Box
                                    component="span"
                                    sx={{
                                        fontFamily: "'Syncopate', sans-serif",
                                        fontWeight: 700,
                                        color: '#4491ba',
                                        fontSize: 'clamp(38px, 7vw, 70px)',
                                        display: 'block',
                                        lineHeight: 0.8,
                                    }}
                                >
                                    Illinois
                                </Box>
                                <Box
                                    component="span"
                                    sx={{
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontWeight: 700,
                                        color: '#929292',
                                        fontSize: 'clamp(24px, 4.5vw, 46px)',
                                        textTransform: 'uppercase',
                                        display: 'block',
                                        letterSpacing: '1px',
                                        lineHeight: 1,
                                    }}
                                >
                                    Nutrient Loss
                                </Box>
                                <Box
                                    component="span"
                                    sx={{
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontWeight: 700,
                                        color: '#929292',
                                        fontSize: 'clamp(16px, 3vw, 31px)',
                                        textTransform: 'uppercase',
                                        display: 'block',
                                        letterSpacing: '1px',
                                        lineHeight: 1,
                                    }}
                                >
                                    Reduction Strategy
                                </Box>
                            </Box>

                            {heroText && <RichContentViewer content={heroText} />}

                            {/* <Box
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
                            </Box> */}
                        </Box>

                        {/* Right Image Section */}
                        {heroRightImage && (
                            <Box
                                sx={{
                                    position: 'relative',
                                    zIndex: 1,
                                    flex: { xs: '1 1 100%', md: '0 0 30%' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: { xs: 'center', md: 'flex-start' },
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: { xs: '200px', md: '300px' },
                                        height: { xs: '200px', md: '300px' },
                                    }}
                                >
                                    <Image
                                        src={`${process.env.CMS_URL}${heroRightImage.url}`}
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
                                            textAlign: { xs: 'center', md: 'left' },
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
            <Box
                sx={{
                    height: 16,
                    width: '100%',
                    background: 'linear-gradient(to right, #7bc144 0%, #3391b1 50%, #385874 100%)',
                }}
            />
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
