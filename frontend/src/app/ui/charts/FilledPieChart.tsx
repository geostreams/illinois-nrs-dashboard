'use client';

import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// Define types for the data structure
type DataTuple = [string, number];

interface DataPoint {
    [key: string]: string | number;
    name: string;
    value: number;
}

interface Colors {
    [key: string]: string;
}

interface FilledPieChartProps {
    data: Array<DataPoint | DataTuple>;
    width: string | number;
    height: string | number;
    colors: Colors;
    fontSize?: number;
    innerRadius?: number | string;
    outerRadius?: number | string;
    dataKey?: string;
    nameKey?: string;
    legend?: boolean;
}

const FilledPieChart: React.FC<FilledPieChartProps> = ({
    data,
    width,
    height,
    colors,
    fontSize = 12,
    innerRadius = 0,
    outerRadius = "80%",
    dataKey = "value",
    nameKey = "name",
    legend = true,
}) => {
    // Function to get legend name, works with both object and array data
    const getLegendName = (entry: string | DataPoint): string => {
        if (typeof entry === 'string') {
            return entry
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase());
        }

        const name = entry[nameKey];
        return typeof name === "string"
            ? name
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
            : String(name);
    };

    // Prepare data for Pie component
    const pieData: DataPoint[] = Array.isArray(data[0])
        ? (data as DataTuple[]).map(([name, value]) => ({
            [nameKey]: name,
            [dataKey]: value,
            name, // ensure name property exists
            value // ensure value property exists
        }))
        : data as DataPoint[];

    return (
        <ResponsiveContainer width={width} height={height}>
            <PieChart>
                <Pie
                    data={pieData}
                    dataKey={dataKey}
                    nameKey={nameKey}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    label
                >
                    {pieData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={colors[entry.name]}
                        />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize }} />
                {legend && (
                    <Legend
                        wrapperStyle={{ fontSize }}
                        formatter={(value: string) => getLegendName(value)}
                    />
                )}
            </PieChart>
        </ResponsiveContainer>
    );
};

export default FilledPieChart;
