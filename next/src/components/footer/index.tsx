import * as React from 'react';
import { Box, Link } from '@mui/material';
import FacebookIcon from '@/assets/icons/facebook.svg';
import Divider from '@mui/material/Divider';
import Image from 'next/image';
import RichContentViewer from '@/components/RichComponentViewer';

type FooterData = {
    leftCard: string;
    rightCard: string;
    partners: {
        partnerImages: {
            alternativeText: string;
            url: string;
            caption: string;
        }[];
        partnersText: string;
    };
    facebookURL: string;
};

type FooterProps = {
    footerData: FooterData;
};

export const Footer: React.FC<FooterProps> = ({ footerData }) => {
    const partnerImageUrls = footerData?.partners.partnerImages.map((partner) => {
        return {
            imageURl: `${process.env.CMS_API_URL}${partner?.url}`,
            alt: partner.alternativeText,
            caption: partner.caption,
        };
    });

    return (
        <div
            className="footer-container"
            style={{
                position: 'relative',
                bottom: 0,
                width: '100%',
            }}
        >
            <Box
                sx={{
                    '@media print': {
                        display: 'none',
                    },
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
                            {partnerImageUrls.map((partnerImage, index) => (
                                <Box
                                    key={`partner-${index}`}
                                    sx={{
                                        width: { xs: '200px', md: '260px' },
                                        height: { xs: '100px', md: '90px' },
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    {/* The caption is a link to the partner's website */}
                                    {partnerImage.caption ? (
                                        <a
                                            href={partnerImage.caption}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ display: 'block', width: '100%', height: '100%' }}
                                        >
                                            <Image
                                                src={partnerImage.imageURl}
                                                alt={partnerImage.alt}
                                                fill
                                                sizes="(max-width: 600px) 240px, 220px"
                                                style={{
                                                    objectFit: 'contain',
                                                }}
                                            />
                                        </a>
                                    ) : (
                                        <Image
                                            src={partnerImage.imageURl}
                                            alt={partnerImage.alt}
                                            fill
                                            sizes="(max-width: 600px) 240px, 220px"
                                            style={{
                                                objectFit: 'contain',
                                            }}
                                        />
                                    )}
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
                            <RichContentViewer content={footerData.partners.partnersText} />
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

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: 4,
                                maxWidth: '1200px',
                                width: '100%',
                                mx: 'auto',
                                padding: '24px',
                                position: 'relative',
                            }}
                        >
                            {/* Left Card */}
                            <Box
                                sx={{
                                    flex: 1,
                                    padding: '16px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <RichContentViewer content={footerData.leftCard} />
                                <Link
                                    href={footerData.facebookURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        textDecoration: 'none',
                                        marginTop: '16px',
                                        '&:hover': {
                                            opacity: 0.8,
                                        },
                                    }}
                                    aria-label="Illinois NRS Facebook Page"
                                >
                                    <FacebookIcon
                                        width={24}
                                        height={24}
                                        fill={'#000'}
                                        style={{ flexShrink: 0 }}
                                        aria-hidden="true"
                                    />
                                </Link>
                            </Box>
                            {/* Right Card */}
                            <Box
                                sx={{
                                    flex: 1,
                                    padding: '16px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    minHeight: '100%',
                                }}
                            >
                                <RichContentViewer content={footerData.rightCard} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
};
