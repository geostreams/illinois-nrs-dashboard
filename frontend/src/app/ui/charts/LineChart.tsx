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
} from "recharts";

// Define types for the data structure
interface DataPoint {
    name: string; // Make name required
    [key: string]: string | number; // Allow additional properties
}

// Define type for line configuration
interface LineConfig {
    dataKey: string;
    color: string;
    dot?: boolean;
    activeDot?: boolean;
    connectNulls?: boolean;
}

// Define props interface
interface LineChartProps {
    data: DataPoint[];
    width: string | number;
    height: string | number;
    lines: LineConfig[];
    xAxisKey?: string;
    fontSize?: number;
    grid?: boolean;
    legend?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
    data,
    width,
    height,
    lines,
    xAxisKey = "name",
    fontSize = 12,
    grid = true,
    legend = true,
}) => {
    // Convert data keys to legend names
    const getLegendName = (key: string): string => {
        return key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
    };

    return (
        <ResponsiveContainer width={width} height={height}>
            <RechartsLineChart data={data}>
                {grid && <CartesianGrid strokeDasharray="3 3" />}
                <XAxis dataKey={xAxisKey} tick={{ fontSize }} height={50} />
                <YAxis tick={{ fontSize }} width={60} />
                <Tooltip
                    contentStyle={{ fontSize }}
                    wrapperStyle={{ fontSize }}
                />
                {legend && (
                    <Legend
                        wrapperStyle={{ fontSize }}
                        formatter={(value: string) => getLegendName(value)}
                    />
                )}

                {lines.map((lineConfig) => (
                    <Line
                        key={lineConfig.dataKey}
                        dataKey={lineConfig.dataKey}
                        stroke={lineConfig.color}
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
                    />
                ))}
            </RechartsLineChart>
        </ResponsiveContainer>
    );
};

export default LineChart;
