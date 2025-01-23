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
    isVisible: boolean;
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({
    chartData,
    chartReferenceLines = [],
    chartColors,
    isVisible,
}) => {
    // Function to convert data keys to readable legend names
    const getLegendName = (key: string): string => key;

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
            {/* Stacked Bar Chart */}
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
                                        isAnimationActive={isVisible}
                                    />
                                ))}

                        {/* Render Reference Lines */}
                        {chartReferenceLines !== null &&
                            chartReferenceLines.map((line) => (
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
        </Box>
    );
};

export default StackedBarChart;
