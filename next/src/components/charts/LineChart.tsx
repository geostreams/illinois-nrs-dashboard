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

// Define types for the data structure
interface DataPoint {
    name: string;
    [key: string]: string | number;
}

// Define type for line configuration
interface LineConfig {
    dataKey: string;
    color: string;
    strokeWidth?: number;
    dot?: boolean;
    activeDot?: boolean;
    connectNulls?: boolean;
}

// Define props interface
interface LineChartProps {
    chartData: DataPoint[];
    chartConfig: LineConfig[];
    isVisible: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
    chartData,
    chartConfig,
    isVisible,
}) => {
    // Convert data keys to legend names
    const getLegendName = (key: string): string =>
        key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend
                    wrapperStyle={{ fontSize: 12 }}
                    formatter={(value: string) => getLegendName(value)}
                />
                {chartConfig.map((lineConfig) => (
                    <Line
                        key={lineConfig.dataKey}
                        dataKey={lineConfig.dataKey}
                        stroke={lineConfig.color}
                        strokeWidth={lineConfig.strokeWidth || 2}
                        dot={
                            lineConfig.dot !== false
                                ? { strokeWidth: 2 }
                                : false
                        }
                        activeDot={
                            lineConfig.activeDot !== false ? { r: 6 } : false
                        }
                        name={getLegendName(lineConfig.dataKey)}
                        connectNulls={lineConfig.connectNulls || false}
                        isAnimationActive={isVisible}
                    />
                ))}
            </RechartsLineChart>
        </ResponsiveContainer>
    );
};

export default LineChart;
