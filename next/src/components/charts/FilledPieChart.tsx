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
import { Box, Typography } from '@mui/material';

interface PieChartProps {
    chart_data: { name: string; value: number }[];
    chart_colors: { [key: string]: string };
    isVisible: boolean;
}

const FilledPieChart: React.FC<PieChartProps> = ({
    chart_data,
    chart_colors,
    isVisible,
}) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={chart_data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius="80%"
                    label
                    isAnimationActive={isVisible}
                >
                    {chart_data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={chart_colors[entry.name]}
                        />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default FilledPieChart;
