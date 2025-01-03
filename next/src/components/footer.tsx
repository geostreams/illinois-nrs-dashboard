import * as React from 'react';
import { Box, Typography, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';

type FooterProps = {
    footerData: any;
};

export const Footer: React.FC<FooterProps> = ({ footerData }) => {
    console.log(footerData?.social_media_links);

    const footerLeftCardImage = `${process.env.NEXT_PUBLIC_CMS_API_URL}${footerData?.left_card?.image?.url}`;

    const iconMap = {
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

    return (
        <>
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
                                width: '150%', // Stretch the width beyond the container
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
                    mt: 4,
                    flexWrap: 'wrap',
                }}
            >
                <Box sx={{ width: 120, height: 60, bgcolor: 'gray', mb: 2 }} />
                <Box sx={{ width: 120, height: 60, bgcolor: 'gray', mb: 2 }} />
                <Box sx={{ width: 120, height: 60, bgcolor: 'gray', mb: 2 }} />
            </Box>
        </>
    );
};
