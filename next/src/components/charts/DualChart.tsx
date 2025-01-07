'use client';

import React from 'react';
import { Box } from '@mui/material';
import FilledPieChart from './FilledPieChart';
import LineChart from './LineChart';
import StackedBarChart from './StackedBarChart';

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
    const renderChart = (chart: ChartDataProps) => {
        switch (chart.chartType) {
            case 'filled_pie':
                return (
                    <FilledPieChart
                        chart_data={chart.chartData}
                        chart_colors={chart.chartColors!}
                        heading={chart.heading}
                        subheading={chart.subheading || ''}
                    />
                );
            case 'line':
                return (
                    <LineChart
                        chartData={chart.chartData}
                        chartConfig={chart.chartConfig!}
                        heading={chart.heading}
                        subheading={chart.subheading || ''}
                    />
                );
            case 'stacked_bar':
                return (
                    <StackedBarChart
                        chartData={chart.chartData}
                        chartReferenceLines={chart.chartReferenceLines || []}
                        chartColors={chart.chartColors!}
                        heading={chart.heading}
                        subheading={chart.subheading || ''}
                    />
                );
            default:
                return null;
        }
    };

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
            <Box>{renderChart(left_chart)}</Box>
            <Box>{renderChart(right_chart)}</Box>
        </Box>
    );
};

export default DualChart;
