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
    heading: string;
    subheading: string;
}

const FilledPieChart: React.FC<PieChartProps> = ({
    chart_data,
    chart_colors,
    heading,
    subheading,
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
            }}
        >
            {/* Heading and Subheading */}
            <Typography variant="h5" component="h1" align="center" gutterBottom>
                {heading}
            </Typography>
            <Typography
                variant="subtitle1"
                component="h2"
                align="center"
                gutterBottom
            >
                {subheading}
            </Typography>

            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={400}>
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
        </Box>
    );
};

export default FilledPieChart;
