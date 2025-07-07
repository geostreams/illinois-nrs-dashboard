'use client';
import React from 'react';
import {
    BarChart as RechartsBarChart,
    Bar,
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

interface BarChartProps {
    chartData: {
        name: string;
        [key: string]: string | number;
    }[];
    chartColors: { [key: string]: string };
    chartReferenceLines?: {
        label: string;
        value: number;
    }[];
    barSize?: number;
    unit?: string;
    yAxisLabel?: string;
}

const BarChart: React.FC<BarChartProps> = ({
    chartData,
    chartColors,
    chartReferenceLines = [],
    barSize = 60,
    unit,
    yAxisLabel,
}) => {
    const dataKey = Object.keys(chartData[0]).find((key) => key !== 'name') || '';
    const barColor = chartColors[dataKey] || '#8884d8';

    return (
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <RechartsBarChart
                data={chartData}
                // margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                    contentStyle={{ fontSize: 12 }}
                    itemStyle={{ color: '#000000' }}
                    formatter={(value) => formatValueWithUnit(value as number, unit)}
                    wrapperStyle={{
                        zIndex: 100,
                        outline: 'none',
                    }}
                />
                <Legend content={ChartLegend} />
                <Bar dataKey={dataKey} fill={barColor} barSize={barSize} isAnimationActive={false} />
                {chartReferenceLines.map((line) => (
                    <ReferenceLine
                        key={line.value}
                        y={line.value}
                        label={{
                            value: line.label,
                            position: 'insideTopRight',
                            fontSize: 12,
                            fill: 'black',
                        }}
                        stroke="red"
                    />
                ))}
            </RechartsBarChart>
        </ResponsiveContainer>
    );
};

export default BarChart;
