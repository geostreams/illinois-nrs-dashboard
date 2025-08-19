'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Box, Button, Typography, Popover, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import FilledPieChart from './FilledPieChart';
import LineChart from './LineChart';
import StackedBarChart from './StackedBarChart';
import BarChart from './BarChart';
import BarLineChart from './BarLineChart';
import StackedBarLineChart from './StackedBarLineChart';
import ClusterBarLineChart from './ClusterBarLineChart';
import HorizontalClusterBarMarkerChart from './HorizontalClusterBarMarkerChart';
import { FC } from 'react';
import TableComponent from './Table';
import { FullSpanImage } from '../PageContentGenerator/FullSpanImage';
import BarMarkerChart from './BarMarkerChart';
import RowSpanTable from './RowSpanTable';

interface BaseChartProps {
    chartType: string;
    heading?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chartData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    miscChartData: any;
    width?: { xs: string; sm: string };
    infoText?: string;
    ariaLabel?: string;
    dataFile?: {
        url: string;
        name: string;
    };
    aspectRatio?: string;
    unit?: string;
    // For
    chartImage?: {
        url: string;
        alternativeText: string;
        caption?: string;
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
    miscChartData,
    width = { xs: '100%', sm: '75%' },
    infoText,
    ariaLabel,
    dataFile,
    aspectRatio,
    unit,
    chartImage,
}) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const headingParts = heading?.split(':');
    const boldHeading = headingParts?.[0];
    const regularHeading = headingParts?.[1];

    const handleInfoClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleInfoClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const handleDownload = useCallback(async () => {
        if (chartType === 'image' && chartImage?.url) {
            setIsLoading(true);
            try {
                const imageUrl = chartImage.url.startsWith('http')
                    ? chartImage.url
                    : `${process.env.CMS_API_URL}${chartImage.url}`;
                const response = await fetch(imageUrl);
                if (!response.ok) throw new Error('Download failed');

                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = heading ? `${heading.toLowerCase().replace(/\s+/g, '-')}.png` : 'chart.png';
                link.click();
                window.URL.revokeObjectURL(link.href);
            } catch (error) {
                console.error('Error downloading image:', error);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        if (!chartRef.current) return;

        setIsLoading(true);
        setIsCapturing(true);

        // Wait for the state change to take effect (hide buttons)
        await new Promise((resolve) => setTimeout(resolve, 50));

        try {
            const element = chartRef.current;
            const isTableChart = chartType === 'row_span_table' || chartType === 'table';

            if (isTableChart) {
                // Use iframe approach for tables (to handle scroll restrictions)
                const iframe = document.createElement('iframe');
                iframe.style.position = 'absolute';
                iframe.style.left = '-9999px';
                iframe.style.top = '-9999px';
                iframe.style.width = '1200px';
                iframe.style.height = '800px';
                iframe.style.border = 'none';
                document.body.appendChild(iframe);

                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (!iframeDoc) {
                    document.body.removeChild(iframe);
                    alert('Could not create export environment');
                    return;
                }

                // Get the table content and heading for iframe
                const headingElement = element.querySelector('[class*="caption"], h1, h2, h3, h4, h5, h6');
                const tableContainer = element.querySelector('.MuiTableContainer-root');
                const chartArea = element.querySelector('canvas, svg, [class*="recharts"], [role="img"]');

                const mainContent = tableContainer || chartArea;

                if (!mainContent) {
                    document.body.removeChild(iframe);
                    alert('Could not find chart or table content to export');
                    return;
                }

                const headingHTML = headingElement ? headingElement.outerHTML : '';
                const contentHTML = mainContent.outerHTML;

                // Get all stylesheets from the current page
                const stylesheets = Array.from(document.styleSheets)
                    .map((sheet) => {
                        try {
                            return Array.from(sheet.cssRules)
                                .map((rule) => rule.cssText)
                                .join('\n');
                        } catch (e) {
                            console.error('Error getting stylesheets:', e);
                        }
                    })
                    .join('\n');

                // Create the iframe page content
                const pageHTML = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Table Export</title>
                        <style>
                            ${stylesheets}

                            .MuiTableContainer-root {
                                max-height: none !important;
                                overflow: visible !important;
                                height: auto !important;
                            }

                            button, [role="button"] {
                                display: none !important;
                            }

                            body {
                                margin: 0;
                                padding: 10px;
                                background: white;
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            }

                            #export-content {
                                display: inline-block;
                                background: white;
                                padding: 0;
                                margin: 0;
                            }

                            * {
                                max-height: none !important;
                                overflow: visible !important;
                            }
                        </style>
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
                    </head>
                    <body>
                        <div id="export-content">
                            ${headingHTML}
                            ${contentHTML}
                        </div>
                    </body>
                    </html>
                `;

                // Write HTML to iframe and capture
                iframeDoc.write(pageHTML);
                iframeDoc.close();

                iframe.onload = async () => {
                    try {
                        await new Promise((resolve) => setTimeout(resolve, 1000));

                        const exportDiv = iframeDoc.getElementById('export-content');
                        if (exportDiv) {
                            const canvas = await html2canvas(exportDiv, {
                                scale: 2,
                                backgroundColor: '#ffffff',
                                logging: false,
                                useCORS: true,
                                allowTaint: true,
                            });

                            const dataUrl = canvas.toDataURL('image/png');

                            const link = document.createElement('a');
                            link.download = `${heading ? heading.toLowerCase().replace(/\s+/g, '-') : 'chart'}.png`;
                            link.href = dataUrl;
                            link.click();

                            document.body.removeChild(iframe);
                        }
                    } catch (error) {
                        console.error('Error capturing table:', error);
                        if (iframe && iframe.parentNode) {
                            document.body.removeChild(iframe);
                        }
                    }
                };
            } else {
                // Direct capture for charts (works better with SVG/Canvas)
                const canvas = await html2canvas(element, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false,
                    useCORS: true,
                    allowTaint: true,
                    filter: (node: Node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const elementNode = node as Element;

                            // Filter out buttons and interactive elements
                            if (
                                elementNode.tagName === 'BUTTON' ||
                                elementNode.getAttribute('role') === 'button' ||
                                elementNode.classList?.contains('MuiButton-root') ||
                                elementNode.classList?.contains('MuiIconButton-root') ||
                                elementNode.getAttribute('aria-label') === 'info' ||
                                elementNode.closest('button') ||
                                elementNode.closest('[role="button"]') ||
                                elementNode.closest('.MuiButton-root') ||
                                elementNode.closest('.MuiIconButton-root')
                            ) {
                                return false;
                            }
                        }
                        return true;
                    },
                });

                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `${heading ? heading.toLowerCase().replace(/\s+/g, '-') : 'chart'}.png`;
                link.href = dataUrl;
                link.click();
            }
        } catch (error) {
            console.error('Error downloading chart:', error);
        } finally {
            setIsCapturing(false);
            setIsLoading(false);
        }
    }, [heading, chartType, chartImage?.url]);

    const handleDataDownload = useCallback(async () => {
        if (!dataFile?.url) return;

        setIsLoading(true);
        try {
            const fileUrl = dataFile.url.startsWith('http')
                ? dataFile.url
                : `${process.env.CMS_API_URL}${dataFile.url}`;
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
    }, [dataFile?.url, dataFile?.name]);

    let barUnit = '';
    let lineUnit = '';
    if (chartType === 'bar_line' || chartType === 'stacked_bar_line' || chartType === 'cluster_bar_line') {
        const unitObject = JSON.parse(
            unit?.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":').replace(/'/g, '"') || '{}'
        );
        barUnit = unitObject.barUnit;
        lineUnit = unitObject.lineUnit;
    }

    const chartComponent = {
        filled_pie: (
            <FilledPieChart
                chart_data={chartData as { name: string; value: number }[]}
                chart_colors={miscChartData?.chartColors}
                unit={unit}
                chartLabels={miscChartData?.chartLabels}
            />
        ),
        line: <LineChart chartData={chartData} chartConfig={miscChartData?.chartConfig} unit={unit} />,
        stacked_bar: (
            <StackedBarChart
                chartData={chartData}
                chartReferenceLines={miscChartData?.chartReferenceLines}
                chartColors={miscChartData?.chartColors}
                unit={unit}
                yAxisInterval={miscChartData?.yAxisInterval}
                yAxisLabel={miscChartData?.yAxisLabel}
            />
        ),
        bar: (
            <BarChart
                chartData={chartData}
                chartColors={miscChartData?.chartColors}
                chartReferenceLines={miscChartData?.chartReferenceLines}
                unit={unit}
                yAxisLabel={miscChartData?.yAxisLabel}
            />
        ),
        bar_line: (
            <BarLineChart
                chartData={chartData}
                barConfig={miscChartData?.barConfig}
                lineConfig={miscChartData?.lineConfig}
                chartReferenceLines={miscChartData?.chartReferenceLines}
                barUnit={barUnit}
                lineUnit={lineUnit}
                yAxisInterval={miscChartData?.yAxisInterval}
                yAxisLabel={miscChartData?.yAxisLabel}
            />
        ),
        stacked_bar_line: (
            <StackedBarLineChart
                chartData={chartData}
                barConfig={miscChartData?.barConfig}
                lineConfig={miscChartData?.lineConfig}
                chartReferenceLines={miscChartData?.chartReferenceLines}
                barUnit={barUnit}
                lineUnit={lineUnit}
                yAxisInterval={miscChartData?.yAxisInterval}
                yAxisLabel={miscChartData?.yAxisLabel}
            />
        ),
        cluster_bar_line: (
            <ClusterBarLineChart
                chartData={chartData}
                barConfig={miscChartData?.barConfig}
                lineConfig={miscChartData?.lineConfig}
                chartReferenceLines={miscChartData?.chartReferenceLines}
                barUnit={barUnit}
                lineUnit={lineUnit}
                yAxisInterval={miscChartData?.yAxisInterval}
                yAxisLabel={miscChartData?.yAxisLabel}
            />
        ),
        horizontal_cluster_bar: (
            <HorizontalClusterBarMarkerChart
                chartData={chartData}
                barConfig={miscChartData?.barConfig}
                lineConfig={miscChartData?.lineConfig}
                markerConfig={miscChartData?.markerConfig}
                chartReferenceLines={miscChartData?.chartReferenceLines}
                barUnit={barUnit}
                lineUnit={lineUnit}
                xAxisInterval={miscChartData?.xAxisInterval}
                xAxisLabel={miscChartData?.xAxisLabel}
            />
        ),
        bar_marker: (
            <BarMarkerChart
                chartData={chartData}
                barConfig={miscChartData?.barConfig}
                lineConfig={miscChartData?.lineConfig}
                markerConfig={miscChartData?.markerConfig}
                chartReferenceLines={miscChartData?.chartReferenceLines}
                barUnit={barUnit}
                lineUnit={lineUnit}
                yAxisInterval={miscChartData?.yAxisInterval}
                yAxisLabel={miscChartData?.yAxisLabel}
            />
        ),
        row_span_table: (
            <RowSpanTable
                tableData={chartData}
                boldenRows={miscChartData?.boldenRows}
                rowSpanColumn={miscChartData?.rowSpanColumn}
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
                my: 3,
                '@media print': {
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid',
                    marginTop: '20px',
                    marginBottom: '20px',
                },
            }}
        >
            <Box sx={{ width: '100%' }}>
                <Typography sx={styles.caption}>
                    <strong>{boldHeading}:</strong>
                    {regularHeading}
                </Typography>
            </Box>
            {chartType !== 'table' && chartType !== 'image' ? (
                <Box
                    sx={{
                        width: '100%',
                        height: 'auto',
                        minHeight: '400px',
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
                    aria-label={ariaLabel}
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
            ) : chartType === 'image' ? (
                <Box sx={{ width: '100%' }} aria-label={ariaLabel}>
                    {chartImage && (
                        <FullSpanImage image={chartImage} imageWidth={100} caption={chartImage?.caption || ''} />
                    )}
                </Box>
            ) : (
                <Box sx={{ width: '100%' }} aria-label={ariaLabel}>
                    <TableComponent tableData={chartData} boldenRows={miscChartData?.boldenRows || []} />
                </Box>
            )}
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
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 0.5,
                            alignItems: { xs: 'stretch', sm: 'center' },
                            mt: 2,
                            width: { xs: '100%', sm: 'auto' },
                        }}
                    >
                        {infoText && (
                            <>
                                <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={handleInfoClick}
                                    aria-label="info"
                                    sx={{
                                        alignSelf: {
                                            xs: 'flex-start',
                                            sm: 'center',
                                        },
                                    }}
                                >
                                    <InfoIcon sx={{ fontSize: '1.8rem' }} titleAccess="Chart information" />
                                </IconButton>
                                <Popover
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleInfoClose}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            pr: 3.5,
                                            maxWidth: 350,
                                            position: 'relative',
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={handleInfoClose}
                                            sx={{
                                                position: 'absolute',
                                                right: 2,
                                                top: 2,
                                                color: 'grey.500',
                                                '&:hover': {
                                                    color: 'grey.700',
                                                },
                                            }}
                                            aria-label="Close additional information"
                                        >
                                            <CloseIcon fontSize="small" titleAccess="Close" />
                                        </IconButton>
                                        <Typography
                                            sx={{
                                                fontSize: '0.9rem',
                                                lineHeight: 1.4,
                                                color: 'text.primary',
                                            }}
                                        >
                                            {infoText}
                                        </Typography>
                                    </Box>
                                </Popover>
                            </>
                        )}
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon titleAccess="Download chart" />}
                            onClick={handleDownload}
                            disabled={isLoading}
                            size="small"
                            sx={{
                                minWidth: 165,
                                width: { xs: '100%', sm: 'auto' },
                            }}
                        >
                            {isLoading ? 'Downloading...' : 'Download Chart'}
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon titleAccess="Download data" />}
                            onClick={handleDataDownload}
                            disabled={isLoading || !dataFile?.url}
                            size="small"
                            sx={{
                                minWidth: 165,
                                width: { xs: '100%', sm: 'auto' },
                            }}
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
