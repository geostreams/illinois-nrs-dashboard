'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import { PhotoBlockProps, TitleProps } from './types';
import PhotoBlock from './photoBlock';
import Title from './title';
import RichContentViewer from '../RichComponentViewer';
import infoSectionBackground from '@/assets/backgrounds/infoSectionBackground.png';

interface InfoBlockProps {
    photoBlocks: PhotoBlockProps[];
    title: TitleProps;
    infoText: string;
}

// Main infoBlock component (simplified version focusing on PhotoBlocks)
const InfoBlock: React.FC<InfoBlockProps> = ({
    photoBlocks,
    title,
    infoText,
}) => {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 6, md: 8 },
                backgroundColor: 'white',
                backgroundImage: `url(${process.env.CMS_API_URL}/uploads/image_data_33b14aa42e.png)`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                width: '100%',
                maxHeight: '100%',
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
                        justifyContent: 'space-between',
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
