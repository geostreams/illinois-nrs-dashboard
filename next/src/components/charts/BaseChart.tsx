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
import TableComponent from './Table';

interface BaseChartProps {
    chartType: string;
    heading?: string;
    chartData: any;
    chartColors?: Record<string, string>;
    miscChartData: any;
    width?: { xs: string; sm: string };
    altText?: string;
    dataFile?: {
        url: string;
        name: string;
    };
    aspectRatio?: string;
    currency?: boolean;
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
    width = { xs: '100%', sm: '75%' },
    altText,
    dataFile,
    aspectRatio,
    currency = false,
}) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    const headingParts = heading?.split(':');
    const boldHeading = headingParts?.[0];
    const regularHeading = headingParts?.[1];
    let fileUrl = `${process.env.CMS_DATA_URL}${dataFile?.url}`;

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

    const chartComponent = {
        filled_pie: (
            <FilledPieChart
                chart_data={chartData as { name: string; value: number }[]}
                chart_colors={chartColors}
                currency={currency}
            />
        ),
        line: (
            <LineChart
                chartData={chartData}
                chartConfig={miscChartData?.chartConfig}
                currency={currency}
            />
        ),
        stacked_bar: (
            <StackedBarChart
                chartData={chartData}
                chartReferenceLines={miscChartData?.chartReferenceLines}
                chartColors={chartColors}
                currency={currency}
            />
        ),
        bar: (
            <BarChart
                chartData={chartData}
                chartColors={chartColors}
                chartReferenceLines={miscChartData?.chartReferenceLines}
                currency={currency}
            />
        ),
        table: <TableComponent tableData={chartData} />,
    }[chartType];

    return (
        <Box
            ref={chartRef}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: width,
                position: 'relative',
                my: 4,
                '@media print': {
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid',
                    marginTop: '20px',
                    marginBottom: '20px',
                },
            }}
        >
            {chartType !== 'table' ? (
                <Box
                    sx={{
                        width: '100%',
                        height: 'auto',
                        bgcolor: 'white',
                        marginBottom: 0.5,
                        position: 'relative',
                        ...(chartType === 'filled_pie'
                            ? {
                                  aspectRatio: '1 / 1',
                                  maxHeight: '400px',
                              }
                            : {
                                  '&::before': {
                                      content: '""',
                                      display: 'block',
                                      paddingTop: aspectRatio || '56.25%',
                                  },
                              }),
                    }}
                    role="img"
                    aria-label={altText}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                    >
                        {chartComponent}
                    </Box>
                </Box>
            ) : (
                <Box sx={{ width: '100%' }}>
                    <TableComponent tableData={chartData} />
                </Box>
            )}
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
