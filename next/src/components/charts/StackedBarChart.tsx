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
import ChartLegend from './chartLegend';
import CustomTooltip from './CustomTooltip';

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
    yAxisLabel?: string;
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
    yAxisLabel,
    yAxisInterval,
}) => {
    // Function to convert data keys to readable legend names
    const getLegendName = (key: string): string => key;

    // Calculate total values for each key and sort them
    const sortedKeys = React.useMemo(() => {
        // Collect all unique keys from all data points
        const allKeys = new Set<string>();
        chartData.forEach((item) => {
            Object.keys(item).forEach((key) => {
                if (key !== 'name') {
                    allKeys.add(key);
                }
            });
        });

        const keys = Array.from(allKeys);
        const totals = keys.reduce(
            (acc, key) => {
                acc[key] = chartData.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
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
                    domain={[yAxisInterval?.min ?? 'auto', yAxisInterval?.max ?? 'auto']}
                    interval="preserveStartEnd"
                    label={
                        yAxisLabel
                            ? {
                                  value: yAxisLabel,
                                  angle: -90,
                                  position: 'insideLeft',
                                  style: {
                                      fontSize: '14px',
                                      fontFamily: 'Montserrat, sans-serif',
                                      fontWeight: '500',
                                      textAnchor: 'middle',
                                  },
                              }
                            : undefined
                    }
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
                                    length: Math.floor((max - min) / interval) + 1,
                                },
                                (_, i) => min + i * interval
                            );
                        }
                        return undefined;
                    })()}
                />
                <Tooltip
                    content={<CustomTooltip unit={unit} />}
                    wrapperStyle={{
                        zIndex: 100,
                        outline: 'none',
                    }}
                />
                <Legend content={ChartLegend} />

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
