'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Box, Button, Typography, Tooltip, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
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
    altText?: string;
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
    altText,
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

    const chartComponent = !isVisible
        ? null
        : {
              filled_pie: (
                  <FilledPieChart
                      chart_data={
                          chartData as { name: string; value: number }[]
                      }
                      chart_colors={chartColors}
                      isVisible={isVisible}
                  />
              ),
              line: (
                  <LineChart
                      chartData={chartData}
                      chartConfig={chartConfig}
                      isVisible={isVisible}
                  />
              ),
              stacked_bar: (
                  <StackedBarChart
                      chartData={chartData}
                      chartReferenceLines={chartReferenceLines}
                      chartColors={chartColors}
                      isVisible={isVisible}
                  />
              ),
          }[chartType];

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
                position: 'relative',
            }}
        >
            {altText && (
                <Tooltip title={altText} placement="top">
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            },
                        }}
                        size="small"
                    >
                        <InfoIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}

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
                role="img"
                aria-label={altText}
            >
                {chartComponent}
            </Box>
        </Box>
    );
};

export default BaseChart;
