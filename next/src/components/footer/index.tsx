import * as React from 'react';
import { Box, Typography, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';

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
        partner_image: PartnerImage[];
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
    const partnerImageUrls = footerData?.partners.partner_image.map(
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
            <Box sx={{ height: 4, bgcolor: '#88B147' }} />
            {/*Main Footer Container*/}
            <Box sx={{ bgcolor: 'primary.dark', color: 'white', p: 4 }}>
                {/* Main Container */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {/* Left Section */}
                    <Box
                        sx={{
                            flex: '1 1 60%',
                            minWidth: '300px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2,
                        }}
                    >
                        <Box
                            sx={{
                                mb: 1,
                                width: '100%', // Stretch the width beyond the container
                                height: '140px', // Adjust the height for a larger image
                                position: 'relative',
                            }}
                        >
                            <Image
                                src={footerLeftCardImage}
                                alt="logo"
                                fill
                                style={{
                                    objectFit: 'cover', // Stretches the image while covering the area
                                }}
                            />
                        </Box>
                        <Box sx={{ maxWidth: 700, textAlign: 'left', p: 2 }}>
                            <BlocksRenderer
                                content={footerData?.left_card.text}
                            />
                        </Box>
                    </Box>

                    {/* Right Section */}
                    <Box sx={{ flex: '1 1 35%', minWidth: '300px', pt: 2 }}>
                        {/* Social Media Icons */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            {footerData.social_media_links.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.URL}
                                    target={link.target}
                                    rel="noopener noreferrer"
                                    aria-label={link.text}
                                    // hover effect
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        backgroundColor:
                                            'rgba(255,255,255,0.2)',
                                    }}
                                >
                                    {iconMap[link.text.toLowerCase()]}
                                </a>
                            ))}
                        </Box>

                        {/* Contact Info */}
                        <BlocksRenderer content={footerData?.right_card} />
                    </Box>
                </Box>
            </Box>
            {/* Bottom Section for Logos */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    mt: 1,
                    gap: 1,
                    p: 1,
                    flexDirection: { xs: 'column', md: 'row' },
                    flexWrap: { md: 'wrap' },
                    maxWidth: '2400px', // Prevent from stretching too wide
                }}
            >
                {partnerImageUrls.map((url, index) => (
                    <Box
                        key={`partner-${index}`}
                        sx={{
                            width: { xs: '280px', md: '320px' },
                            height: { xs: '140px', md: '160px' },
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            transition: 'transform 0.3s ease-in-out', // Smooth transition for hover
                            '&:hover': {
                                transform: 'scale(1.05)', // Scale up by 5% on hover
                                cursor: 'pointer', // Optional: change cursor to pointer
                            },
                        }}
                    >
                        <Image
                            src={url}
                            alt={`Partner`}
                            fill
                            sizes="(max-width: 600px) 280px, 320px"
                            style={{
                                objectFit: 'contain',
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </div>
    );
};
