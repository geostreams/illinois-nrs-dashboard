'use client';
import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { formatLargeNumber } from '@/utils/formatters';

interface PieChartProps {
    chart_data: { name: string; value: number }[];
    chart_colors: { [key: string]: string };
    currency?: boolean;
}

const FilledPieChart: React.FC<PieChartProps> = ({
    chart_data,
    chart_colors,
    currency = false,
}) => {
    return (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                    data={chart_data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius="80%"
                    label={(entry) => formatLargeNumber(entry.value, currency)}
                    isAnimationActive={false}
                >
                    {chart_data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={chart_colors[entry.name]}
                        />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value) =>
                        formatLargeNumber(value as number, currency)
                    }
                    wrapperStyle={{
                        zIndex: 100,
                        outline: 'none',
                    }}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default FilledPieChart;
