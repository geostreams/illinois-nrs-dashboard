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
} from 'recharts';
import { formatValueWithUnit } from '@/utils/formatters';
import ChartLegend from './chartLegend';

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
}

const LineChart: React.FC<LineChartProps> = ({ chartData, chartConfig, unit }) => {
    return (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <RechartsLineChart
                data={chartData}
                // margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatValueWithUnit(value, unit)} width={40} />
                <Tooltip
                    contentStyle={{ fontSize: 12 }}
                    formatter={(value) => formatValueWithUnit(value as number, unit)}
                    wrapperStyle={{
                        zIndex: 100,
                        outline: 'none',
                    }}
                />
                <Legend content={ChartLegend} />
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
            </RechartsLineChart>
        </ResponsiveContainer>
    );
};

export default LineChart;
