'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Box, Typography, Paper, styled, Grid } from '@mui/material';
import { PhotoBlockProps } from './types';

// Styled components
const BlockHeader = styled(Box)(({ bgcolor }: { bgcolor: string }) => ({
    paddingTop: 5,
    paddingBottom: 4,
    backgroundColor: bgcolor,
    textAlign: 'center',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    width: '100%',
}));

const BlockImage = styled(Box)(({ theme }) => ({
    backgroundColor: '#0a1930', // Dark blue background for Illinois outline
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 310,
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
const PhotoBlock = ({ title, blockColor, image }: PhotoBlockProps) => {
    return (
        <PhotoBlockContainer>
            <Grid container direction="column" spacing={0}>
                <Grid item>
                    <BlockHeader bgcolor={blockColor}>
                        <Typography
                            variant="subtitle1"
                            fontFamily={'Sans-Serif'}
                            fontWeight="bold"
                            color="white"
                        >
                            {title}
                        </Typography>
                    </BlockHeader>
                </Grid>
                <Grid item>
                    <BlockImage>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            border={`1px solid ${blockColor}`}
                        >
                            <Image
                                src={`${process.env.CMS_API_URL || ''}${image.url}`}
                                alt={image.alternativeText || title}
                                width={250}
                                height={310}
                                priority
                            />
                        </Box>
                    </BlockImage>
                </Grid>
            </Grid>
        </PhotoBlockContainer>
    );
};

export default PhotoBlock;
