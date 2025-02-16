'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Box, Button, Typography, Tooltip, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import html2canvas from 'html2canvas';
import FilledPieChart from './FilledPieChart';
import LineChart from './LineChart';
import StackedBarChart from './StackedBarChart';
import BarChart from './BarChart';
import { FC } from 'react';

interface BaseChartProps {
    chartType: string;
    heading?: string;
    chartData: any;
    chartColors?: Record<string, string>;
    miscChartData: any;
    width?: string | number;
    height?: number;
    altText?: string;
    dataFile?: {
        url: string;
        name: string;
    };
}

const styles = {
    caption: {
        fontSize: '16px',
        color: '#0A3977',
        textAlign: 'left',
        fontStyle: 'italic',
    },
};

const BaseChart: FC<BaseChartProps> = ({
    chartType,
    heading,
    chartData,
    chartColors = {},
    miscChartData,
    width = '100%',
    height = 400,
    altText,
    dataFile,
}) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    const [isVisible, setIsVisible] = useState(false);

    const headingParts = heading?.split(':');
    const boldHeading = headingParts?.[0];
    const regularHeading = headingParts?.[1];
    let fileUrl = `${process.env.NEXT_PUBLIC_CMS_API_URL}${dataFile?.url}`;

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
                scale: 2,
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

    const handleDataDownload = useCallback(async () => {
        if (!dataFile?.url) return;

        setIsLoading(true);
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = dataFile?.name || 'data.csv';
            link.click();
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [dataFile?.url, fileUrl]);

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
                      chartConfig={miscChartData?.chartConfig}
                      isVisible={isVisible}
                  />
              ),
              stacked_bar: (
                  <StackedBarChart
                      chartData={chartData}
                      chartReferenceLines={miscChartData?.chartReferenceLines}
                      chartColors={chartColors}
                      isVisible={isVisible}
                  />
              ),
              bar: (
                  <BarChart
                      chartData={chartData}
                      chartColors={chartColors}
                      chartReferenceLines={miscChartData?.chartReferenceLines}
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
                width: width,
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: height,
                    bgcolor: 'white',
                    marginBottom: 0.5,
                }}
                role="img"
                aria-label={altText}
            >
                {chartComponent}
            </Box>
            <Box sx={{ width: '100%' }}>
                <Typography sx={styles.caption}>
                    <strong>{boldHeading}:</strong>
                    {regularHeading}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    width: '100%',
                }}
            >
                {!isCapturing && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 0.5,
                            alignItems: 'center',
                            mt: 2,
                        }}
                    >
                        {altText && (
                            <Tooltip title={altText} placement="top">
                                <IconButton color="primary" size="small">
                                    <InfoIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownload}
                            disabled={isLoading}
                            size="small"
                            sx={{ minWidth: 165 }}
                        >
                            {isLoading ? 'Downloading...' : 'Download Chart'}
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={handleDataDownload}
                            disabled={isLoading || !dataFile?.url}
                            size="small"
                            sx={{ minWidth: 165 }}
                        >
                            {isLoading ? 'Downloading...' : 'Download Data'}
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default BaseChart;
