'use client';

import React from 'react';
import {
    ComposedChart,
    Bar,
    Line,
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

interface BarConfig {
    dataKey: string;
    name: string;
    color: string;
    barSize?: number;
}

interface LineConfig {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
    dot?: boolean;
    activeDot?: boolean;
    connectNulls?: boolean;
}

interface StackedBarLineChartProps {
    chartData: {
        name: string;
        [key: string]: string | number;
    }[];
    barConfig: BarConfig[];
    lineConfig: LineConfig[];
    chartReferenceLines?: {
        label: string;
        value: number;
        axis?: 'left' | 'right';
    }[];
    barUnit?: string;
    lineUnit?: string;
    yAxisInterval?: {
        left?: {
            min?: number;
            max?: number;
            interval?: number;
        };
        right?: {
            min?: number;
            max?: number;
            interval?: number;
        };
    };
}

const StackedBarLineChart: React.FC<StackedBarLineChartProps> = ({
    chartData,
    barConfig,
    lineConfig,
    chartReferenceLines = [],
    barUnit,
    lineUnit,
    yAxisInterval,
}) => {
    // Sort bar data keys by their total values for better visualization
    const sortedBarConfig = React.useMemo(() => {
        if (!chartData || chartData.length === 0 || !barConfig || barConfig.length <= 1) {
            return barConfig;
        }

        const totals = barConfig.reduce(
            (acc, config) => {
                acc[config.dataKey] = chartData.reduce((sum, item) => sum + (Number(item[config.dataKey]) || 0), 0);
                return acc;
            },
            {} as Record<string, number>
        );

        return [...barConfig].sort((a, b) => totals[b.dataKey] - totals[a.dataKey]);
    }, [chartData, barConfig]);

    return (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />

                {/* Left Y-Axis for Bars */}
                <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatValueWithUnit(value, barUnit)}
                    width={40}
                    domain={[yAxisInterval?.left?.min ?? 'auto', yAxisInterval?.left?.max ?? 'auto']}
                    interval="preserveStartEnd"
                    ticks={(() => {
                        if (
                            yAxisInterval?.left &&
                            typeof yAxisInterval.left.interval === 'number' &&
                            typeof yAxisInterval.left.max === 'number' &&
                            typeof yAxisInterval.left.min === 'number'
                        ) {
                            const { min, max, interval } = yAxisInterval.left;
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

                {/* Right Y-Axis for Lines (if there are line keys) */}
                {lineConfig.length > 0 && (
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => formatValueWithUnit(value, lineUnit)}
                        width={40}
                        domain={[yAxisInterval?.right?.min ?? 'auto', yAxisInterval?.right?.max ?? 'auto']}
                        interval="preserveStartEnd"
                        ticks={(() => {
                            if (
                                yAxisInterval?.right &&
                                typeof yAxisInterval.right.interval === 'number' &&
                                typeof yAxisInterval.right.max === 'number' &&
                                typeof yAxisInterval.right.min === 'number'
                            ) {
                                const { min, max, interval } = yAxisInterval.right;
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
                )}

                <Tooltip
                    content={
                        <CustomTooltip
                            barUnit={barUnit}
                            lineUnit={lineUnit}
                            barConfig={barConfig}
                            lineConfig={lineConfig}
                        />
                    }
                    wrapperStyle={{
                        zIndex: 100,
                        outline: 'none',
                    }}
                />
                <Legend content={(props) => <ChartLegend {...props} lineConfig={lineConfig} />} />

                {/* Render Bars */}
                {sortedBarConfig.map((config) => (
                    <Bar
                        key={config.dataKey}
                        yAxisId="left"
                        dataKey={config.dataKey}
                        name={config.name}
                        fill={config.color}
                        stackId="a"
                        barSize={config.barSize || 40}
                        isAnimationActive={false}
                    />
                ))}

                {/* Render Lines */}
                {lineConfig.map((config) => (
                    <Line
                        key={config.dataKey}
                        yAxisId="right"
                        type="linear"
                        dataKey={config.dataKey}
                        name={config.name}
                        stroke={config.color}
                        strokeWidth={config.strokeWidth || 2}
                        dot={config.dot !== false ? { strokeWidth: 2 } : false}
                        activeDot={config.activeDot !== false ? { r: 6 } : false}
                        connectNulls={config.connectNulls || true}
                        isAnimationActive={false}
                    />
                ))}

                {/* Render Reference Lines */}
                {chartReferenceLines.map((line) => (
                    <ReferenceLine
                        key={line.value}
                        y={line.value}
                        yAxisId={line.axis || 'left'}
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
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default StackedBarLineChart;
