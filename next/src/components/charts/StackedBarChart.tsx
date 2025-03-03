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
    yAxisInterval?: {
        min?: number;
        max?: number;
        interval?: number;
    };
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({
    chartData,
    chartReferenceLines = [],
    chartColors,
    unit,
    yAxisInterval,
}) => {
    // Function to convert data keys to readable legend names
    const getLegendName = (key: string): string => key;

    // Calculate total values for each key and sort them
    const sortedKeys = React.useMemo(() => {
        const keys = Object.keys(chartData[0] || {}).filter(
            (key) => key !== 'name'
        );
        const totals = keys.reduce(
            (acc, key) => {
                acc[key] = chartData.reduce(
                    (sum, item) => sum + (Number(item[key]) || 0),
                    0
                );
                return acc;
            },
            {} as Record<string, number>
        );

        return keys.sort((a, b) => totals[b] - totals[a]);
    }, [chartData]);

    return (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <BarChart
                data={chartData}
                // margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatValueWithUnit(value, unit)}
                    width={40}
                    domain={[
                        yAxisInterval?.min ?? 'auto',
                        yAxisInterval?.max ?? 'auto',
                    ]}
                    interval="preserveStartEnd"
                    ticks={(() => {
                        if (
                            yAxisInterval &&
                            typeof yAxisInterval.interval === 'number' &&
                            typeof yAxisInterval.max === 'number' &&
                            typeof yAxisInterval.min === 'number'
                        ) {
                            const { min, max, interval } = yAxisInterval;
                            return Array.from(
                                {
                                    length:
                                        Math.floor((max - min) / interval) + 1,
                                },
                                (_, i) => min + i * interval
                            );
                        }
                        return undefined;
                    })()}
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

                {/* Render Bars with sorted keys */}
                {sortedKeys.map((key) => (
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
                                fontFamily: 'Montserrat, sans-serif',
                                fontSize: '12px',
                                fontWeight: 'normal',
                                paintOrder: 'stroke',
                                stroke: '#ffffff',
                                strokeWidth: '1px',
                                strokeLinejoin: 'round',
                                strokeLinecap: 'round',
                                fill: '#000000',
                            }}
                            stroke="#0A8754"
                            strokeWidth={2}
                        />
                    ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StackedBarChart;
