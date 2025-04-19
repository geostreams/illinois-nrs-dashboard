import React from 'react';
import { Box } from '@mui/material';
import BaseChart from './BaseChart';

// Define props interface for charts
interface ChartDataProps {
    chart: {
        chartType: 'filled_pie' | 'line' | 'stacked_bar';
        caption: string;
        chartData: any;
        chartColors?: { [key: string]: string };
        miscChartData: any;
        dataFile: {
            url: string;
            name: string;
        };
        unit?: string;
        infoText?: string;
        ariaLabel?: string;
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
                width: { xs: '100%', md: '100%%' },
                gap: '20px',
            }}
        >
            <BaseChart
                chartType={left_chart.chart.chartType}
                chartData={left_chart.chart.chartData}
                chartColors={left_chart.chart.chartColors}
                miscChartData={left_chart.chart.miscChartData}
                heading={left_chart.chart.caption}
                dataFile={left_chart.chart.dataFile}
                aspectRatio={'100%'}
                unit={left_chart.chart.unit}
                infoText={left_chart.chart.infoText}
                ariaLabel={left_chart.chart.ariaLabel}
            />
            <BaseChart
                chartType={right_chart.chart.chartType}
                chartData={right_chart.chart.chartData}
                chartColors={right_chart.chart.chartColors}
                miscChartData={right_chart.chart.miscChartData}
                heading={right_chart.chart.caption}
                dataFile={right_chart.chart.dataFile}
                aspectRatio={'100%'}
                unit={right_chart.chart.unit}
                infoText={right_chart.chart.infoText}
                ariaLabel={right_chart.chart.ariaLabel}
            />
        </Box>
    );
};

export default DualChart;
