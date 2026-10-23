'use client';

import React from 'react';
import {
    LineChart as RechartsLineChart,
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

// Define types for the data structure
interface DataPoint {
    name: string;
    [key: string]: string | number;
}

// Define type for line configuration
interface LineConfig {
    color: string;
    strokeWidth?: number;
    dot?: boolean;
    activeDot?: boolean;
    connectNulls?: boolean;
}

// Define props interface
interface LineChartProps {
    chartData: DataPoint[];
    chartConfig: { [key: string]: LineConfig };
    unit?: string;
    referenceLine?: number;
    yAxisLabel?: string;
}

const LineChart: React.FC<LineChartProps> = ({ chartData, chartConfig, unit, yAxisLabel, referenceLine }) => {
    // Convert chartConfig to lineConfig format so that the legend shows lines instead of squares
    const lineConfig = Object.entries(chartConfig).map(([key, config]) => ({
        dataKey: key,
        name: key,
        color: config.color,
        strokeWidth: config.strokeWidth,
        dot: config.dot,
        activeDot: config.activeDot,
        connectNulls: config.connectNulls,
    }));

    return (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <RechartsLineChart
                data={chartData}
                accessibilityLayer={true}
                // margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatValueWithUnit(value, unit)}
                    width={40}
                    label={
                        yAxisLabel
                            ? {
                                  value: yAxisLabel,
                                  angle: -90,
                                  offset: -0.5,
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
                />
                <Tooltip
                    content={<CustomTooltip unit={unit} lineConfig={lineConfig} />}
                    wrapperStyle={{
                        zIndex: 100,
                        outline: 'none',
                    }}
                />
                <Legend content={(props) => <ChartLegend {...props} lineConfig={lineConfig} />} />
                {Object.entries(chartConfig).map(([key, lineConfig]) => (
                    <Line
                        key={key}
                        dataKey={key}
                        stroke={lineConfig.color}
                        strokeWidth={lineConfig.strokeWidth || 2}
                        dot={lineConfig.dot !== false ? { strokeWidth: 2 } : false}
                        activeDot={lineConfig.activeDot !== false ? { r: 6 } : false}
                        name={key}
                        connectNulls={lineConfig.connectNulls || false}
                        isAnimationActive={false}
                    />
                ))}

                {typeof referenceLine === 'number' && <ReferenceLine y={referenceLine} />}
            </RechartsLineChart>
        </ResponsiveContainer>
    );
};

export default LineChart;
