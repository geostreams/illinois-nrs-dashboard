import * as React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';
import Divider from '@mui/material/Divider';
import Image from 'next/image';

interface LinkItem {
    icon: {
        url: string;
    };
    text: string;
    URL: string;
    target?: string;
}

export interface StayInformedData {
    title?: string;
    subtitle?: string;
    links?: LinkItem[];
}

export const StayInformed = ({ subtitle, links = [] }: StayInformedData) => {
    return (
        <div
            style={{
                position: 'relative',
                bottom: 0,
                width: '100%',
            }}
        >
            {/*Small height box for a colored line*/}
            <Box
                sx={{
                    height: 16,
                    width: '100%',
                    background: 'linear-gradient(to right, #7bc144 0%, #3391b1 50%, #385874 100%)',
                }}
            />
            <Box
                sx={{
                    backgroundColor: '#002A47', // Dark blue background as shown in the image
                    color: 'white',
                    paddingTop: 8,
                    paddingBottom: 8,
                    px: 2,
                }}
            >
                <Container maxWidth="lg">
                    {/* Title with two-tone styling */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                fontSize: '3.75rem',
                                fontWeight: 600,
                                fontFamily: 'Bebas Neue',
                            }}
                            tabIndex={0}
                        >
                            <Box component="span" sx={{ color: 'white' }}>
                                STAY
                            </Box>{' '}
                            <Box component="span" sx={{ color: '#CCE3AA' }}>
                                INFORMED
                            </Box>
                        </Typography>
                    </Box>

                    {/* Divider line */}
                    <Divider
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            mb: 2,
                            mt: -1.5,
                        }}
                    />

                    {/* Description text */}
                    {subtitle && (
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            {subtitle}
                        </Typography>
                    )}

                    {/* Links with icons */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        {links.map((link, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                {link.icon && (
                                    <Box sx={{ width: 24, height: 24 }}>
                                        <Image
                                            src={`${process.env.CMS_URL}${link.icon.url}`}
                                            alt=""
                                            width={24}
                                            height={24}
                                        />
                                    </Box>
                                )}
                                <Link
                                    href={link.URL}
                                    color="inherit"
                                    underline="hover"
                                    target={link.target ? link.target : '_blank'}
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: '1.1rem',
                                    }}
                                >
                                    {link.text}
                                </Link>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>
        </div>
    );
};
