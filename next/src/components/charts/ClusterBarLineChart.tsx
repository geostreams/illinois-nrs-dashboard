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

interface ClusterBarLineChartProps {
    chartData: {
        name: string;
        [key: string]: string | number;
    }[];
    barConfig: BarConfig[];
    lineConfig?: LineConfig[];
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
    barCategoryGap?: string | number;
    barGap?: number;
    yAxisLabel?: {
        left?: string;
        right?: string;
    };
}

const ClusterBarLineChart: React.FC<ClusterBarLineChartProps> = ({
    chartData,
    barConfig,
    lineConfig = [],
    chartReferenceLines = [],
    barUnit,
    lineUnit,
    yAxisInterval,
    barCategoryGap = '20%',
    barGap = 0,
    yAxisLabel,
}) => {
    return (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <ComposedChart data={chartData} barCategoryGap={barCategoryGap} barGap={barGap} accessibilityLayer={true}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />

                <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatValueWithUnit(value, barUnit)}
                    width={40}
                    domain={[yAxisInterval?.left?.min ?? 'auto', yAxisInterval?.left?.max ?? 'auto']}
                    interval="preserveStartEnd"
                    label={
                        yAxisLabel?.left
                            ? {
                                  value: yAxisLabel.left,
                                  angle: -90,
                                  position: 'left',
                                  textAnchor: 'middle',
                                  offset: 0,
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

                <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatValueWithUnit(value, lineUnit)}
                    width={40}
                    domain={[yAxisInterval?.right?.min ?? 'auto', yAxisInterval?.right?.max ?? 'auto']}
                    interval="preserveStartEnd"
                    label={
                        yAxisLabel?.right
                            ? {
                                  value: yAxisLabel.right,
                                  angle: 90,
                                  position: 'right',
                                  textAnchor: 'middle',
                                  offset: 0,
                                  style: {
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      fontFamily: 'Montserrat, sans-serif',
                                      textAnchor: 'middle',
                                  },
                              }
                            : undefined
                    }
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

                {barConfig.map((config) => (
                    <Bar
                        key={config.dataKey}
                        yAxisId="left"
                        dataKey={config.dataKey}
                        name={config.name}
                        fill={config.color}
                        barSize={config.barSize || 40}
                        isAnimationActive={false}
                        radius={[2, 2, 0, 0]}
                    />
                ))}

                {lineConfig.map((config) => (
                    <Line
                        key={config.dataKey}
                        yAxisId={yAxisInterval?.right ? 'right' : 'left'}
                        type="linear"
                        dataKey={config.dataKey}
                        name={config.name}
                        stroke={config.color}
                        strokeWidth={config.strokeWidth || 2}
                        dot={config.dot !== false ? { strokeWidth: 2 } : false}
                        activeDot={config.activeDot !== false ? { r: 6 } : false}
                        connectNulls={config.connectNulls || false}
                        isAnimationActive={false}
                    />
                ))}

                {chartReferenceLines.map((line, index) => (
                    <ReferenceLine
                        key={`${line.value}-${index}`}
                        y={line.value}
                        yAxisId={line.axis || 'left'}
                        label={{
                            value: line.label,
                            position: 'insideTopRight',
                            fontSize: 12,
                            fill: 'black',
                        }}
                        stroke="red"
                        strokeDasharray="5 5"
                    />
                ))}
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default ClusterBarLineChart;
