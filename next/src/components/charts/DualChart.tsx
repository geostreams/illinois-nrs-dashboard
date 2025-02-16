import React from 'react';
import { Box } from '@mui/material';
import BaseChart from './BaseChart';

// Define props interface for charts
interface ChartDataProps {
    chart: {
        chartType: 'filled_pie' | 'line' | 'stacked_bar';
        caption: string;
        subheading?: string;
        chartData: any;
        chartColors?: { [key: string]: string };
        miscChartData: any;
        dataFile: {
            url: string;
            name: string;
        }[];
    };
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
                width: '75%',
                '& > div': {
                    width: { xs: '100%', md: '50%' },
                    minWidth: '300px',
                },
            }}
        >
            <BaseChart
                chartType={left_chart.chart.chartType}
                chartData={left_chart.chart.chartData}
                chartColors={left_chart.chart.chartColors}
                miscChartData={left_chart.chart.miscChartData}
                heading={left_chart.chart.caption}
                dataFile={left_chart.chart.dataFile[0]}
            />
            <BaseChart
                chartType={right_chart.chart.chartType}
                chartData={right_chart.chart.chartData}
                chartColors={right_chart.chart.chartColors}
                miscChartData={right_chart.chart.miscChartData}
                heading={right_chart.chart.caption}
                dataFile={right_chart.chart.dataFile[0]}
            />
        </Box>
    );
};

export default DualChart;
