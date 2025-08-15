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
    Scatter,
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

interface MarkerConfig {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
    dashArray?: string; // For dashed lines, e.g., "5 5"
}

interface BarLineChartProps {
    chartData: {
        name: string;
        [key: string]: string | number;
    }[];
    barConfig: BarConfig[];
    lineConfig?: LineConfig[];
    markerConfig?: MarkerConfig[];
    chartReferenceLines?: {
        label: string;
        value: number;
        axis?: 'bottom' | 'top';
    }[];
    barUnit?: string;
    lineUnit?: string;
    xAxisInterval?: {
        bottom?: {
            min?: number;
            max?: number;
            interval?: number;
        };
        top?: {
            min?: number;
            max?: number;
            interval?: number;
        };
    };
    xAxisLabel?: {
        bottom?: string;
        top?: string;
    };
    barCategoryGap?: string | number;
    barGap?: number;
}

const BarLineChart: React.FC<BarLineChartProps> = ({
    chartData,
    barConfig,
    lineConfig,
    markerConfig,
    chartReferenceLines = [],
    barUnit,
    lineUnit,
    yAxisInterval,
    yAxisLabel,
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
                />

                {yAxisInterval?.right && (
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
                    />
                )}

                <Tooltip
                    content={
                        <CustomTooltip
                            barUnit={barUnit}
                            lineUnit={lineUnit}
                            barConfig={barConfig}
                            lineConfig={lineConfig}
                            markerConfig={markerConfig}
                        />
                    }
                    wrapperStyle={{
                        zIndex: 100,
                        outline: 'none',
                    }}
                />
                <Legend
                    content={(props) => <ChartLegend {...props} lineConfig={lineConfig} markerConfig={markerConfig} />}
                />

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

                {lineConfig &&
                    lineConfig.map((config) => (
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
                {markerConfig &&
                    markerConfig
                        .filter((config) =>
                            chartData.some(
                                (dataPoint) =>
                                    dataPoint[config.dataKey] !== null &&
                                    dataPoint[config.dataKey] !== undefined &&
                                    dataPoint[config.dataKey] !== ''
                            )
                        )
                        .map((config) => {
                            // Create custom shape for horizontal line markers
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const CustomLineMarker = (props: any) => {
                                const { cx, cy, fill, stroke, payload } = props;

                                // Don't render if value is invalid
                                const value = payload[config.dataKey];
                                if (value === null || value === undefined || value === '') {
                                    return null;
                                }

                                const lineWidth = config.strokeWidth || 4;
                                // Dynamic width based on actual bar sizes - extend across the bar area
                                const totalBarWidth = barConfig.reduce((sum, bar) => sum + (bar.barSize || 40), 0);
                                const lineLength = totalBarWidth;

                                return (
                                    <line
                                        x1={cx - lineLength / 2}
                                        y1={cy}
                                        x2={cx + lineLength / 2}
                                        y2={cy}
                                        stroke={stroke || fill}
                                        strokeWidth={lineWidth}
                                        strokeDasharray={config.dashArray || undefined}
                                    />
                                );
                            };

                            return (
                                <Scatter
                                    key={`marker-${config.dataKey}`}
                                    yAxisId="left"
                                    dataKey={config.dataKey}
                                    name={config.name}
                                    fill={config.color}
                                    stroke={config.color}
                                    strokeWidth={config.strokeWidth || 4}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    shape={CustomLineMarker as any}
                                    isAnimationActive={false}
                                />
                            );
                        })}

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
