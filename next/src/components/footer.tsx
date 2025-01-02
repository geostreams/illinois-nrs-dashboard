import React from 'react';
import { Box, Typography, Link, Grid } from '@mui/material';

export const Footer = ()=> {
    return (
        <Box sx={{ bgcolor: 'primary.dark', color: 'white', p: 4 }}>
            <Grid container spacing={4}>
                {/* Left Section */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        ILLINOIS NUTRIENT LOSS REDUCTION STRATEGY
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Improving our water resources with collaboration and innovation
                    </Typography>
                    <Typography variant="body2">
                        The Illinois NLRS is a collaborative partnership that includes
                        University of Illinois Extension, Illinois Environmental Protection
                        Agency, Illinois Department of Agriculture, and many other
                        organizations.
                    </Typography>
                </Grid>

                {/* Right Section */}
                <Grid item xs={12} md={4}>
                    {/* Social Media Icons */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'flex-start' }}>
                        <Box sx={{ width: 24, height: 24, bgcolor: 'gray', borderRadius: '50%' }} />
                        <Box sx={{ width: 24, height: 24, bgcolor: 'gray', borderRadius: '50%' }} />
                        <Box sx={{ width: 24, height: 24, bgcolor: 'gray', borderRadius: '50%' }} />
                        <Box sx={{ width: 24, height: 24, bgcolor: 'gray', borderRadius: '50%' }} />
                        <Box sx={{ width: 24, height: 24, bgcolor: 'gray', borderRadius: '50%' }} />
                    </Box>

                    {/* Contact Info */}
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Contact Us:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        1-217-244-7298
                    </Typography>
                    <Link href="mailto:NLRS@illinois.edu" color="inherit" sx={{ mb: 2 }}>
                        NLRS@illinois.edu
                    </Link>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Learn more about the Illinois Strategy and partners at{' '}
                        <Link href="https://go.illinois.edu/NLRS" color="inherit">
                            go.illinois.edu/NLRS
                        </Link>
                    </Typography>
                    <Typography variant="body2">
                        Explore ways to reduce nutrient loss at{' '}
                        <Link href="https://go.illinois.edu/NutrientLoss" color="inherit">
                            go.illinois.edu/NutrientLoss
                        </Link>
                    </Typography>
                </Grid>

                {/* Bottom Section for Logos */}
                <Grid item xs={12}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            mt: 4,
                        }}
                    >
                        <Box sx={{ width: 120, height: 60, bgcolor: 'gray' }} />
                        <Box sx={{ width: 120, height: 60, bgcolor: 'gray' }} />
                        <Box sx={{ width: 120, height: 60, bgcolor: 'gray' }} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
