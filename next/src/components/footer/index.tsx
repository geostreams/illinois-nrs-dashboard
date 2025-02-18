import * as React from 'react';
import { Box, Typography, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import Divider from '@mui/material/Divider';
import Image from 'next/image';
import RichContentViewer from '@/components/RichComponentViewer';

type SocialMediaLink = {
    id: string | number;
    URL: string;
    target: string;
    text: string;
};

type PartnerImage = {
    formats: {
        thumbnail: {
            url: string;
        };
    };
};

type FooterData = {
    left_card: {
        image: {
            url: string;
        };
        text: any;
    };
    right_card: any; // Content to render in the right card (BlocksRenderer-compatible)
    social_media_links: SocialMediaLink[];
    partners: {
        partnerImages: PartnerImage[];
        partnersText: string;
    };
};

type FooterProps = {
    footerData: FooterData;
};

export const Footer: React.FC<FooterProps> = ({ footerData }) => {
    const footerLeftCardImage = `${process.env.NEXT_PUBLIC_CMS_API_URL}${footerData?.left_card?.image?.url}`;
    const iconMap: { [key: string]: React.ReactNode } = {
        facebook: (
            <FacebookIcon sx={{ width: 24, height: 24, color: 'white' }} />
        ),
        twitter: <TwitterIcon sx={{ width: 24, height: 24, color: 'white' }} />,
        youtube: <YouTubeIcon sx={{ width: 24, height: 24, color: 'white' }} />,
        linkedin: (
            <LinkedInIcon sx={{ width: 24, height: 24, color: 'white' }} />
        ),
        instagram: (
            <InstagramIcon sx={{ width: 24, height: 24, color: 'white' }} />
        ),
    };
    const partnerImageUrls = footerData?.partners.partnerImages.map(
        (partner) => {
            return `${process.env.NEXT_PUBLIC_CMS_API_URL}${partner.formats?.thumbnail.url}`;
        }
    );

    return (
        <div
            className="footer-container"
            style={{
                position: 'relative',
                bottom: 0,
                width: '100%',
                marginTop: '200px',
            }}
        >
            {/*Small height box for a colored line*/}
            <Box sx={{ display: 'flex', width: '100%' }}>
                <Box sx={{ height: 4, bgcolor: '#2E5EA3', width: '50%' }} />
                <Box sx={{ height: 4, bgcolor: '#88B147', width: '50%' }} />
            </Box>

            {/* Bottom Section for Logos */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 1,
                    px: 4,
                }}
            >
                <Box
                    sx={{
                        maxWidth: '1200px',
                        width: '100%',
                        mx: 'auto',
                        padding: '24px',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 4,
                            flexDirection: { xs: 'column', md: 'row' },
                            flexWrap: { md: 'wrap' },
                        }}
                    >
                        {partnerImageUrls.map((url, index) => (
                            <Box
                                key={`partner-${index}`}
                                sx={{
                                    width: { xs: '200px', md: '180px' },
                                    height: { xs: '100px', md: '90px' },
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        cursor: 'pointer',
                                    },
                                }}
                            >
                                <Image
                                    src={url}
                                    alt={`Partner`}
                                    fill
                                    sizes="(max-width: 600px) 200px, 180px"
                                    style={{
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                    <Box
                        sx={{
                            mt: 3,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            '& a': {
                                color: '#2E5EA3',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            },
                        }}
                    >
                        <RichContentViewer
                            content={footerData.partners.partnersText}
                        />
                    </Box>
                    <Divider
                        sx={{
                            width: '100%',
                            borderColor: '#B0BEC5',
                            borderWidth: 1,
                            opacity: 1,
                            marginTop: 2,
                            marginBottom: 0,
                        }}
                    />
                </Box>
            </Box>
        </div>
    );
};
