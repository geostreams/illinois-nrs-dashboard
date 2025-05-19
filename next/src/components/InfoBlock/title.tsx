import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { TitleProps } from './types';

// Title component for displaying two-colored headings
const Title = ({ firstHalf, secondHalf, firstHalfColor, secondHalfColor }: TitleProps) => {
    return (
        <>
            <Typography
                variant="h2"
                fontFamily={'Bebas Neue'}
                component="h2"
                fontWeight="bold"
                sx={{ mb: 0, lineHeight: 1 }}
            >
                <Box component="span" sx={{ color: firstHalfColor }}>
                    {firstHalf}
                </Box>
                <Box component="span" sx={{ color: secondHalfColor }}>
                    {secondHalf}
                </Box>
            </Typography>
            <Divider sx={{ mt: -1, mb: 2 }} />
        </>
    );
};

export default Title;
