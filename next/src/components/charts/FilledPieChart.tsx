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
import { formatValueWithUnit } from '@/utils/formatters';

interface PieChartProps {
    chart_data: { name: string; value: number }[];
    chart_colors: { [key: string]: string };
    unit?: string;
    miscChartData: any;
}

const FilledPieChart: React.FC<PieChartProps> = ({
    chart_data,
    chart_colors,
    unit,
    miscChartData,
}) => {
    const getLabel = (entry: any) => {
        if (
            miscChartData?.chartLabels &&
            miscChartData.chartLabels[entry.name]
        ) {
            console.log(miscChartData.chartLabels[entry.name]);
            return miscChartData.chartLabels[entry.name];
        }
        return formatValueWithUnit(entry.value, unit);
    };

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
                    label={getLabel}
                    isAnimationActive={false}
                    width={10}
                >
                    {chart_data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={chart_colors[entry.name]}
                        />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value, name) => {
                        const formattedValue = formatValueWithUnit(
                            value as number,
                            unit
                        );
                        if (
                            miscChartData?.chartLabels &&
                            miscChartData.chartLabels[name]
                        ) {
                            return [miscChartData.chartLabels[name], name];
                        }
                        return [formattedValue, name];
                    }}
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
