'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';
import FilledPieChart from './FilledPieChart';
import LineChart from './LineChart';
import StackedBarChart from './StackedBarChart';
import { FC } from 'react';

interface BaseChartProps {
    chartType: string;
    heading?: string;
    subheading?: string;
    chartData: any;
    chartColors?: Record<string, string>;
    chartConfig?: any[];
    chartReferenceLines?: any[];
    width?: string | number;
    height?: number;
}

const BaseChart: FC<BaseChartProps> = ({
    chartType,
    heading,
    subheading,
    chartData,
    chartColors = {},
    chartConfig = [],
    chartReferenceLines = [],
    width = '100%',
    height = 400,
}) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        if (chartRef.current) {
            observer.observe(chartRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleDownload = useCallback(async () => {
        if (!chartRef.current) return;

        setIsLoading(true);
        setIsCapturing(true); // Hide button before capture

        try {
            // Wait for state update to take effect
            await new Promise((resolve) => setTimeout(resolve, 50));

            const canvas = await html2canvas(chartRef.current, {
                scale: 1,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
            });

            const link = document.createElement('a');
            if (heading) {
                link.download = `${heading.toLowerCase().replace(/\s+/g, '-')}.png`;
            } else {
                link.download = 'chart.png';
            }
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error downloading chart:', error);
        } finally {
            setIsCapturing(false); // Show button after capture
            setIsLoading(false);
        }
    }, [heading]);

    const renderChart = () => {
        if (!isVisible) return null;
        switch (chartType) {
            case 'filled_pie':
                return (
                    <FilledPieChart
                        chart_data={
                            chartData as { name: string; value: number }[]
                        }
                        chart_colors={chartColors}
                        isVisible={isVisible}
                    />
                );
            case 'line':
                return (
                    <LineChart
                        chartData={chartData}
                        chartConfig={chartConfig}
                        isVisible={isVisible}
                    />
                );
            case 'stacked_bar':
                return (
                    <StackedBarChart
                        chartData={chartData}
                        chartReferenceLines={chartReferenceLines}
                        chartColors={chartColors}
                        isVisible={isVisible}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Box
            ref={chartRef}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                width: width,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 2,
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    {heading && (
                        <Typography variant="h5" component="h5" gutterBottom>
                            {heading}
                        </Typography>
                    )}
                    {subheading && (
                        <Typography
                            variant="subtitle1"
                            component="h6"
                            color="text.secondary"
                        >
                            {subheading}
                        </Typography>
                    )}
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        width: '100%',
                    }}
                >
                    {/* Hide button when downloading chart so it doesn't get captured */}
                    {!isCapturing && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mt: 2,
                            }}
                        >
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={handleDownload}
                                disabled={isLoading}
                                size="small"
                                sx={{ mb: 1, minWidth: 165 }}
                            >
                                {isLoading
                                    ? 'Downloading...'
                                    : 'Download Chart'}
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                disabled={isLoading}
                                size="small"
                                sx={{ minWidth: 165 }}
                            >
                                {isLoading ? 'Downloading...' : 'Download Data'}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            <Box
                sx={{
                    width: '100%',
                    height: height,
                    bgcolor: 'white',
                }}
            >
                {renderChart()}
            </Box>
        </Box>
    );
};

export default BaseChart;
