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

interface BarLineChartProps {
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

const BarLineChart: React.FC<BarLineChartProps> = ({
    chartData,
    barConfig,
    lineConfig,
    chartReferenceLines = [],
    barUnit,
    lineUnit,
    yAxisInterval,
}) => {
    return (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />

                <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                        formatValueWithUnit(value, barUnit)
                    }
                    width={40}
                    domain={[
                        yAxisInterval?.left?.min ?? 'auto',
                        yAxisInterval?.left?.max ?? 'auto',
                    ]}
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
                                    length:
                                        Math.floor((max - min) / interval) + 1,
                                },
                                (_, i) => min + i * interval
                            );
                        }
                        return undefined;
                    })()}
                />

                <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                        formatValueWithUnit(value, lineUnit)
                    }
                    width={40}
                    domain={[
                        yAxisInterval?.right?.min ?? 'auto',
                        yAxisInterval?.right?.max ?? 'auto',
                    ]}
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
                    formatter={(value, name, props) => {
                        const isBar = barConfig.some(
                            (config) => config.dataKey === props.dataKey
                        );
                        const unit = isBar ? barUnit : lineUnit;
                        return formatValueWithUnit(value as number, unit);
                    }}
                    wrapperStyle={{
                        zIndex: 100,
                        outline: 'none',
                    }}
                />
                <Legend content={ChartLegend} />

                {barConfig.map((config) => (
                    <Bar
                        key={config.dataKey}
                        yAxisId="left"
                        dataKey={config.dataKey}
                        name={config.name}
                        fill={config.color}
                        barSize={config.barSize || 40}
                        isAnimationActive={false}
                    />
                ))}

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
                        activeDot={
                            config.activeDot !== false ? { r: 6 } : false
                        }
                        connectNulls={config.connectNulls || false}
                        isAnimationActive={false}
                    />
                ))}

                {chartReferenceLines.map((line) => (
                    <ReferenceLine
                        key={line.value}
                        y={line.value}
                        yAxisId={line.axis || 'left'}
                        label={{
                            value: line.label,
                            position: 'insideTopRight',
                            fontSize: 12,
                            fill: 'black',
                        }}
                        stroke="red"
                    />
                ))}
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default BarLineChart;
