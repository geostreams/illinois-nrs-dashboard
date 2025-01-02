import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export const Footer = () => {
    return (
        <>
            <Box sx={{ bgcolor: 'primary.dark', color: 'white', p: 4 }}>
                {/* Main Container */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {/* Left Section */}
                    <Box sx={{ flex: '1 1 60%', minWidth: '300px' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            ILLINOIS NUTRIENT LOSS REDUCTION STRATEGY
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Improving our water resources with collaboration and
                            innovation
                        </Typography>
                        <Typography variant="body2">
                            The Illinois NLRS is a collaborative partnership
                            that includes University of Illinois Extension,
                            Illinois Environmental Protection Agency, Illinois
                            Department of Agriculture, and many other
                            organizations.
                        </Typography>
                    </Box>

                    {/* Right Section */}
                    <Box sx={{ flex: '1 1 35%', minWidth: '300px' }}>
                        {/* Social Media Icons */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: 'gray',
                                    borderRadius: '50%',
                                }}
                            />
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: 'gray',
                                    borderRadius: '50%',
                                }}
                            />
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: 'gray',
                                    borderRadius: '50%',
                                }}
                            />
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: 'gray',
                                    borderRadius: '50%',
                                }}
                            />
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: 'gray',
                                    borderRadius: '50%',
                                }}
                            />
                        </Box>

                        {/* Contact Info */}
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Contact Us:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            1-217-244-7298
                        </Typography>
                        <Link
                            href="mailto:NLRS@illinois.edu"
                            color="inherit"
                            sx={{ mb: 2 }}
                        >
                            NLRS@illinois.edu
                        </Link>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Learn more about the Illinois Strategy and partners
                            at{' '}
                            <Link
                                href="https://go.illinois.edu/NLRS"
                                color="inherit"
                            >
                                go.illinois.edu/NLRS
                            </Link>
                        </Typography>
                        <Typography variant="body2">
                            Explore ways to reduce nutrient loss at{' '}
                            <Link
                                href="https://go.illinois.edu/NutrientLoss"
                                color="inherit"
                            >
                                go.illinois.edu/NutrientLoss
                            </Link>
                        </Typography>
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
