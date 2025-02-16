'use client';
import React from 'react';
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';

interface BarChartProps {
    chartData: {
        name: string;
        [key: string]: string | number;
    }[];
    chartColors: { [key: string]: string };
    chartReferenceLines?: {
        label: string;
        value: number;
    }[];
    isVisible: boolean;
    barSize?: number;
}

const BarChart: React.FC<BarChartProps> = ({
    chartData,
    chartColors,
    chartReferenceLines = [],
    isVisible,
    barSize = 60,
}) => {
    // Get the first data key that isn't 'name'
    const dataKey =
        Object.keys(chartData[0]).find((key) => key !== 'name') || '';
    const barColor = chartColors[dataKey] || '#8884d8';

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
                data={chartData}
                margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />

                <Bar
                    dataKey={dataKey}
                    fill={barColor}
                    barSize={barSize}
                    isAnimationActive={isVisible}
                />

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
            </RechartsBarChart>
        </ResponsiveContainer>
    );
};

export default BarChart;
