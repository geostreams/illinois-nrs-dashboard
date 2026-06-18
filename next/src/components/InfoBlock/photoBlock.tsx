import React from 'react';
import Image from 'next/image';
import { Box, Typography, Paper, styled } from '@mui/material';
import { PhotoBlockProps } from './types';

// Styled components
const BlockHeader = styled(Box)(({ bgcolor }: { bgcolor: string }) => ({
    paddingTop: 5,
    paddingBottom: 2,
    backgroundColor: bgcolor,
    textAlign: 'center',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    width: '100%',
}));

const BlockImage = styled(Box)(() => ({
    backgroundColor: '#0a1930', // Dark blue background for Illinois outline
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 250,
    width: '100%',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
}));

const PhotoBlockContainer = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 250,
    boxShadow: theme.shadows[2],
    overflow: 'hidden',
    borderRadius: 4,
}));

// PhotoBlock component for displaying each Illinois state map
const PhotoBlock = ({ title, blockColor, image, imageWidth, imageHeight, url }: PhotoBlockProps) => {
    // Default dimensions if not provided or null
    const defaultWidth = 250;
    const defaultHeight = 310;

    // Ensure we have valid numeric dimensions
    const validWidth = imageWidth || defaultWidth;
    const validHeight = imageHeight || defaultHeight;
    return (
        <PhotoBlockContainer>
            <Box
                onClick={() => {
                    if (url) window.location.assign(url);
                }}
                sx={{ cursor: url ? 'pointer' : 'default' }}
            >
                <BlockHeader bgcolor={blockColor}>
                    <Typography
                        variant="subtitle2"
                        component="span"
                        fontFamily={'Sans-Serif'}
                        fontWeight="bold"
                        color="white"
                    >
                        {title}
                    </Typography>
                </BlockHeader>
                <BlockImage
                    sx={{
                        border: `1px solid ${blockColor}`,
                    }}
                >
                    <Image
                        src={`${process.env.CMS_URL || ''}${image.url}`}
                        alt={image.alternativeText || title}
                        width={validWidth}
                        height={validHeight}
                        priority
                        style={{ width: '100%', height: 'auto' }}
                    />
                </BlockImage>
            </Box>
        </PhotoBlockContainer>
    );
};

export default PhotoBlock;
