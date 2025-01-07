'use client';

import React from 'react';
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';

// Define types for the data structure
interface DataPoint {
    name: string; // Make name required
    [key: string]: string | number; // Allow additional properties
}

// Define type for line configuration
interface LineConfig {
    dataKey: string;
    color: string;
    strokeWidth?: number;
    dot?: boolean;
    activeDot?: boolean;
    connectNulls?: boolean;
}

// Define props interface
interface LineChartProps {
    chartData: DataPoint[];
    chartConfig: LineConfig[];
    heading: string;
    subheading?: string;
}

const LineChart: React.FC<LineChartProps> = ({
    chartData,
    chartConfig,
    heading,
    subheading,
}) => {
    // Convert data keys to legend names
    const getLegendName = (key: string): string =>
        key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
            }}
        >
            {/* Heading and Subheading */}
            <Typography variant="h5" component="h1" align="center" gutterBottom>
                {heading}
            </Typography>
            {subheading && (
                <Typography
                    variant="subtitle1"
                    component="h2"
                    align="center"
                    gutterBottom
                >
                    {subheading}
                </Typography>
            )}

            {/* Line Chart */}
            <Box
                sx={{
                    width: {
                        xs: '100%',
                        md: '80%',
                    },
                    height: 400,
                    margin: 'auto',
                }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ fontSize: 12 }} />
                        <Legend
                            wrapperStyle={{ fontSize: 12 }}
                            formatter={(value: string) => getLegendName(value)}
                        />
                        {chartConfig.map((lineConfig) => (
                            <Line
                                key={lineConfig.dataKey}
                                dataKey={lineConfig.dataKey}
                                stroke={lineConfig.color}
                                strokeWidth={lineConfig.strokeWidth || 2}
                                dot={
                                    lineConfig.dot !== false
                                        ? { strokeWidth: 2 }
                                        : false
                                }
                                activeDot={
                                    lineConfig.activeDot !== false
                                        ? { r: 6 }
                                        : false
                                }
                                name={getLegendName(lineConfig.dataKey)}
                                connectNulls={lineConfig.connectNulls || false}
                            />
                        ))}
                    </RechartsLineChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default LineChart;
