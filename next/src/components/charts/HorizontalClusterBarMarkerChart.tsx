'use client';

import React from 'react';
import {
    ComposedChart,
    Bar,
    Line,
    Scatter,
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

interface MarkerConfig {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
    dashArray?: string; // For dashed lines, e.g., "5 5"
}

interface ClusterBarLineChartProps {
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
        axis?: 'left' | 'right';
    }[];
    barUnit?: string;
    lineUnit?: string;
    xAxisInterval?: {
        top?: {
            min?: number;
            max?: number;
            interval?: number;
        };
        bottom?: {
            min?: number;
            max?: number;
            interval?: number;
        };
    };
    barCategoryGap?: string | number;
    barGap?: number;
    xAxisLabel?: {
        top?: string;
        bottom?: string;
    };
}

const HorizontalClusterBarMarkerChart: React.FC<ClusterBarLineChartProps> = ({
    chartData,
    barConfig,
    lineConfig = [],
    markerConfig = [],
    chartReferenceLines = [],
    barUnit,
    lineUnit,
    xAxisInterval,
    barCategoryGap = '20%',
    barGap = 0,
    xAxisLabel,
}) => {
    return (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <ComposedChart data={chartData} barCategoryGap={barCategoryGap} barGap={barGap} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                <XAxis
                    xAxisId="left"
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatValueWithUnit(value, barUnit)}
                    orientation="bottom"
                    domain={[xAxisInterval?.bottom?.min ?? 'auto', xAxisInterval?.bottom?.max ?? 'auto']}
                    ticks={(() => {
                        if (
                            xAxisInterval?.bottom &&
                            typeof xAxisInterval.bottom.interval === 'number' &&
                            typeof xAxisInterval.bottom.max === 'number' &&
                            typeof xAxisInterval.bottom.min === 'number'
                        ) {
                            const { min, max, interval } = xAxisInterval.bottom;
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
                        xAxisLabel?.bottom
                            ? {
                                  value: xAxisLabel.bottom,
                                  position: 'insideBottom',
                                  offset: -5,
                                  textAnchor: 'middle',
                                  style: {
                                      fontSize: '14px',
                                      fontFamily: 'Montserrat, sans-serif',
                                      fontWeight: '500',
                                  },
                              }
                            : undefined
                    }
                />

                <XAxis
                    xAxisId="right"
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatValueWithUnit(value, lineUnit)}
                    orientation="top"
                    domain={[xAxisInterval?.top?.min ?? 'auto', xAxisInterval?.top?.max ?? 'auto']}
                    ticks={(() => {
                        if (
                            xAxisInterval?.top &&
                            typeof xAxisInterval.top.interval === 'number' &&
                            typeof xAxisInterval.top.max === 'number' &&
                            typeof xAxisInterval.top.min === 'number'
                        ) {
                            const { min, max, interval } = xAxisInterval.top;
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
                        xAxisLabel?.top
                            ? {
                                  value: xAxisLabel.top,
                                  position: 'insideTop',
                                  offset: 5,
                                  textAnchor: 'middle',
                                  style: {
                                      fontSize: '14px',
                                      fontFamily: 'Montserrat, sans-serif',
                                      fontWeight: '500',
                                  },
                              }
                            : undefined
                    }
                />

                <YAxis
                    yAxisId="left"
                    type="category"
                    dataKey="name"
                    orientation="left"
                    tick={{ fontSize: 12 }}
                    width={80}
                    interval={0}
                />

                <YAxis
                    yAxisId="right"
                    type="category"
                    dataKey="name"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    width={80}
                    interval={0}
                    hide
                />

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
                        xAxisId="left"
                        yAxisId="left"
                        dataKey={config.dataKey}
                        name={config.name}
                        fill={config.color}
                        barSize={config.barSize || 40}
                        isAnimationActive={false}
                        radius={[0, 2, 2, 0]}
                    />
                ))}

                {lineConfig.map((config) => (
                    <Line
                        key={config.dataKey}
                        xAxisId="right"
                        yAxisId="right"
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

                {markerConfig
                    .filter((config) =>
                        chartData.some(
                            (dataPoint) =>
                                dataPoint[config.dataKey] !== null &&
                                dataPoint[config.dataKey] !== undefined &&
                                dataPoint[config.dataKey] !== ''
                        )
                    )
                    .map((config) => {
                        // Create custom shape for vertical line markers
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const CustomLineMarker = (props: any) => {
                            const { cx, cy, fill, stroke, payload } = props;

                            // Don't render if value is invalid
                            const value = payload[config.dataKey];
                            if (value === null || value === undefined || value === '') {
                                return null;
                            }

                            const lineWidth = config.strokeWidth || 4;
                            // Dynamic height based on actual bar sizes
                            const totalBarHeight = barConfig.reduce((sum, bar) => sum + (bar.barSize || 40), 0);
                            const lineHeight = totalBarHeight * 0.6; // 60% of total bar height

                            return (
                                <line
                                    x1={cx}
                                    y1={cy - lineHeight / 2}
                                    x2={cx}
                                    y2={cy + lineHeight / 2}
                                    stroke={stroke || fill}
                                    strokeWidth={lineWidth}
                                    strokeDasharray={config.dashArray || undefined}
                                />
                            );
                        };

                        return (
                            <Scatter
                                key={`marker-${config.dataKey}`}
                                xAxisId="left"
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

                {chartReferenceLines.map((line, index) => (
                    <ReferenceLine
                        key={`${line.value}-${index}`}
                        x={line.value}
                        label={{
                            value: line.label,
                            position: 'insideTopLeft',
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

export default HorizontalClusterBarMarkerChart;
