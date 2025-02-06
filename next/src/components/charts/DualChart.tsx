import React from 'react';
import { Box } from '@mui/material';
import BaseChart from './BaseChart';

// Define props interface for charts
interface ChartDataProps {
    chartType: 'filled_pie' | 'line' | 'stacked_bar';
    heading: string;
    subheading?: string;
    chartData: any;
    chartColors?: { [key: string]: string };
    chartConfig?: any;
    chartReferenceLines?: any;
}

interface DualChartProps {
    left_chart: ChartDataProps;
    right_chart: ChartDataProps;
}

const DualChart: React.FC<DualChartProps> = ({ left_chart, right_chart }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4,
                width: '100%',
                '& > div': {
                    width: { xs: '100%', md: '50%' },
                    minWidth: '300px',
                },
            }}
        >
            <BaseChart {...left_chart} />
            <BaseChart {...right_chart} />
        </Box>
    );
};

export default DualChart;
