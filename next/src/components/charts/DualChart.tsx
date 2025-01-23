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
    const renderChart = (chart: ChartDataProps) => {
        switch (chart.chartType) {
            case 'filled_pie':
                return (
                    <BaseChart
                        chartType="filled_pie"
                        chartData={chart.chartData}
                        chartColors={chart.chartColors!}
                        heading={chart.heading}
                        subheading={chart.subheading || ''}
                    />
                );
            case 'line':
                return (
                    <BaseChart
                        chartType="line"
                        chartData={chart.chartData}
                        chartConfig={chart.chartConfig!}
                        heading={chart.heading}
                        subheading={chart.subheading || ''}
                    />
                );
            case 'stacked_bar':
                return (
                    <BaseChart
                        chartType="stacked_bar"
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
            {renderChart(left_chart)}
            {renderChart(right_chart)}
        </Box>
    );
};

export default DualChart;
