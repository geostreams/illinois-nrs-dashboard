import React from 'react';
import { Box } from '@mui/material';
import { ImageWithPDF } from './ImageWithPDF';

// Define props interface for individual maps
interface MapDataProps {
    id: number;
    caption: string;
    infoText?: string;
    imageWidth?: number;
    image: {
        alternativeText?: string;
        caption?: string;
        width?: number;
        height?: number;
        url: string;
    };
    pdf: {
        name: string;
        url: string;
    };
}

interface DualMapProps {
    leftMap: MapDataProps;
    rightMap: MapDataProps;
}

const DualMap: React.FC<DualMapProps> = ({ leftMap, rightMap }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                width: '100%',
                gap: '20px',
                marginTop: 2,
                marginBottom: 3,
            }}
        >
            <Box sx={{ flex: 1 }}>
                <ImageWithPDF
                    caption={leftMap.caption}
                    infoText={leftMap.infoText}
                    image={leftMap.image}
                    pdf={leftMap.pdf}
                    imageWidth={leftMap.imageWidth || 100}
                    bordered={false}
                />
            </Box>
            <Box sx={{ flex: 1 }}>
                <ImageWithPDF
                    caption={rightMap.caption}
                    infoText={rightMap.infoText}
                    image={rightMap.image}
                    pdf={rightMap.pdf}
                    imageWidth={rightMap.imageWidth || 100}
                    bordered={false}
                />
            </Box>
        </Box>
    );
};

export default DualMap;
