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
    barSize?: number;
    currency?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
    chartData,
    chartColors,
    chartReferenceLines = [],
    barSize = 60,
    currency = false,
}) => {
    const dataKey =
        Object.keys(chartData[0]).find((key) => key !== 'name') || '';
    const barColor = chartColors[dataKey] || '#8884d8';

    return (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <RechartsBarChart
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                        currency
                            ? `$${Intl.NumberFormat('en-US').format(value)}`
                            : Intl.NumberFormat('en-US').format(value)
                    }
                />
                <Tooltip
                    contentStyle={{ fontSize: 12 }}
                    formatter={(value) =>
                        currency
                            ? `$${Intl.NumberFormat('en-US').format(value as number)}`
                            : Intl.NumberFormat('en-US').format(value as number)
                    }
                    wrapperStyle={{
                        zIndex: 100,
                        outline: 'none',
                    }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                    dataKey={dataKey}
                    fill={barColor}
                    barSize={barSize}
                    isAnimationActive={false}
                />
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
