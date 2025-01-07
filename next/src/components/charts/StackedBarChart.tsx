'use client';
import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import { Box, Typography } from '@mui/material';

interface StackedBarChartProps {
    chartData: {
        name: string;
        [key: string]: string | number;
    }[];
    chartReferenceLines: {
        label: string;
        value: number;
    }[];
    chartColors: { [key: string]: string };
    heading: string;
    subheading?: string;
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({
    chartData,
    chartReferenceLines,
    chartColors,
    heading,
    subheading,
}) => {
    // Function to convert data keys to readable legend names
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
            {heading && (
                <Typography
                    variant="h5"
                    component="h1"
                    align="center"
                    gutterBottom
                >
                    {heading}
                </Typography>
            )}
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
            {/* Stacked Bar Chart */}
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />

                    {/* Render Bars */}
                    {chartData[0] &&
                        Object.keys(chartData[0])
                            .filter((key) => key !== 'name')
                            .map((key) => (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    stackId="a"
                                    fill={chartColors[key]}
                                    name={getLegendName(key)}
                                />
                            ))}

                    {/* Render Reference Lines */}
                    {chartReferenceLines.map((line) => (
                        <ReferenceLine
                            key={line.value}
                            y={line.value}
                            label={{
                                value: line.label,
                                position: 'insideTopRight',
                                fontSize: 12,
                                fill: 'black',
                            }}
                            stroke="red"
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default StackedBarChart;
