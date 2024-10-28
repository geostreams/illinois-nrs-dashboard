import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const CustomPieChart = ({
    data,
    width,
    height,
    colors,
    fontSize = 12,
    innerRadius = 0,
    outerRadius = "80%",
    dataKey = "value",
    nameKey = "name",
}) => {
    // Function to get legend name, works with both object and array data
    const getLegendName = (entry) => {
        const name = entry[nameKey] || entry;
        return typeof name === "string"
            ? name
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())
            : name;
    };

    // Prepare data for Pie component
    const pieData = Array.isArray(data[0])
        ? data.map(([name, value]) => ({ [nameKey]: name, [dataKey]: value }))
        : data;

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
                        <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize }} />
                <Legend wrapperStyle={{ fontSize }} formatter={getLegendName} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CustomPieChart;
