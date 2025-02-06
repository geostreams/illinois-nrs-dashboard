import React from 'react';
import Box from '@mui/material/Box';
import RichContentViewer from '@/components/RichComponentViewer';
import FilledPieChart from '@/components/charts/FilledPieChart';
import StackedBarChart from '@/components/charts/StackedBarChart';
import LineChart from '@/components/charts/LineChart';
import DualChart from '@/components/charts/DualChart';
import { ComponentRenderer } from '@/components/PageContentGenerator/ComponentRenderer';

interface PageContentGeneratorProps {
    pageContents: any[];
}

export const PageContentGenerator: React.FC<PageContentGeneratorProps> = ({
    pageContents,
}) => {
    return (
        <Box>
            {pageContents.map((component, index) => (
                <Box key={index} sx={{ my: 4 }}>
                    <ComponentRenderer component={component} />
                </Box>
            ))}
        </Box>
    );
};
