import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

const StackedBarChart = ({
    data,
    width,
    height,
    barColors,
    fontSize = 12,
    referenceLines,
    legend = true,
}) => {
    // Convert data keys to legend names
    const getLegendName = (key) => {
        return key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
    };

    return (
        <ResponsiveContainer width={width} height={height}>
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize }} />
                <YAxis tick={{ fontSize }} />
                <Tooltip contentStyle={{ fontSize }} />
                {legend && <Legend wrapperStyle={{ fontSize }} />}
                {data[0] &&
                    Object.keys(data[0])
                        .filter((key) => key !== "name")
                        .map((key) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                stackId="a"
                                fill={barColors[key]}
                                name={getLegendName(key)}
                            />
                        ))}
                {referenceLines &&
                    referenceLines.map((line) => (
                        <ReferenceLine
                            key={line.value}
                            y={line.value}
                            label={{
                                value: line.label,
                                position: "insideTopRight",
                                fontSize,
                                color: "black",
                            }}
                            stroke="red"
                        />
                    ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StackedBarChart;
