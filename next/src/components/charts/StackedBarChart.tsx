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
    currency?: boolean;
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({
    chartData,
    chartReferenceLines = [],
    chartColors,
    currency = false,
}) => {
    // Function to convert data keys to readable legend names
    const getLegendName = (key: string): string => key;

    return (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 25 }}
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
                                isAnimationActive={false}
                                barSize={60}
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
    );
};

export default StackedBarChart;
