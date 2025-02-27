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
import { formatValueWithUnit } from '@/utils/formatters';

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
    unit?: string;
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({
    chartData,
    chartReferenceLines = [],
    chartColors,
    unit,
}) => {
    // Function to convert data keys to readable legend names
    const getLegendName = (key: string): string => key;

    return (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <BarChart
                data={chartData}
                // margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatValueWithUnit(value, unit)}
                    width={40}
                />
                <Tooltip
                    contentStyle={{ fontSize: 12 }}
                    formatter={(value) =>
                        formatValueWithUnit(value as number, unit)
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
                                barSize={40}
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
                                fontSize: 16,
                                fontWeight: 'bold',
                                fill: '#000000',
                                stroke: '#ffffff',
                                strokeWidth: 1,
                            }}
                            stroke="#00ff00"
                            strokeWidth={2}
                        />
                    ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StackedBarChart;
