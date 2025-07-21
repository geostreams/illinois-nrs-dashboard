'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import { PhotoBlockProps, TitleProps } from './types';
import PhotoBlock from './photoBlock';
import Title from './title';
import RichContentViewer from '../RichComponentViewer';

interface InfoBlockProps {
    photoBlocks: PhotoBlockProps[];
    title: TitleProps;
    infoText: string;
    imageWidth: number | null;
    imageHeight: number | null;
    paddingTop: number | null;
    paddingBottom: number | null;
}

// Main infoBlock component (simplified version focusing on PhotoBlocks)
const InfoBlock: React.FC<InfoBlockProps> = ({
    photoBlocks,
    title,
    infoText,
    imageWidth,
    imageHeight,
    paddingTop,
    paddingBottom,
}) => {
    return (
        <Box
            component="section"
            sx={{
                pt: paddingTop,
                pb: paddingBottom,
                backgroundColor: 'white',
                backgroundImage: {
                    xs: 'none',
                    md: `url(${process.env.CMS_API_URL}/uploads/image_data_33b14aa42e.png)`,
                },
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 55%',
                WebkitMaskImage:
                    'linear-gradient(to right, transparent, black 10%, black 90%, transparent), linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                maskImage:
                    'linear-gradient(to right, transparent, black 10%, black 90%, transparent), linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
            }}
        >
            <Container maxWidth="lg">
                {/* Title */}
                {title && (
                    <Title
                        firstHalf={title.firstHalf}
                        secondHalf={title.secondHalf}
                        firstHalfColor={title.firstHalfColor}
                        secondHalfColor={title.secondHalfColor}
                    />
                )}
                {/* Photo blocks */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: {
                            xs: 'center',
                            md: 'space-between',
                        },
                        flexDirection: {
                            xs: 'column',
                            md: 'row',
                        },
                        alignItems: {
                            xs: 'center',
                            md: 'flex-start',
                        },
                        gap: { xs: 3, md: 4 },
                        mb: 4,
                    }}
                >
                    {photoBlocks?.map((block) => (
                        <PhotoBlock
                            key={block.id}
                            id={block.id}
                            title={block.title}
                            blockColor={block.blockColor}
                            image={{
                                url: block.image.url,
                                alternativeText: block.image.alternativeText,
                            }}
                            imageWidth={imageWidth}
                            imageHeight={imageHeight}
                        />
                    ))}
                </Box>

                {/* Info Text */}
                {infoText && <RichContentViewer content={infoText} />}
            </Container>
        </Box>
    );
};

export default InfoBlock;
