import { Typography, Box, Container } from "@mui/material";
import TextDisplay from "../../components/TextDisplay";
import StackedBarChart from "../../components/charts/StackedBarChart";
import FilledPieChart from "../../components/charts/FilledPieChart";
import LineChart from "../../components/charts/LineCharts";

// Stacked Bar Chart
const ps_data = [
    {
        name: "2011",
        majorMunicipalFacilities: 16.7,
        minorMunicipalFacilities: 1.3,
        industrialFacilities: 0.1,
    },
    {
        name: "2017",
        majorMunicipalFacilities: 11.4,
        minorMunicipalFacilities: 1.3,
        industrialFacilities: 0.29,
    },
    {
        name: "2018",
        majorMunicipalFacilities: 11.08,
        minorMunicipalFacilities: 1.3,
        industrialFacilities: 0.26,
    },
    {
        name: "2019",
        majorMunicipalFacilities: 12.1,
        minorMunicipalFacilities: 1.3,
        industrialFacilities: 0.36,
    },
    {
        name: "2020",
        majorMunicipalFacilities: 12.3,
        minorMunicipalFacilities: 1.3,
        industrialFacilities: 0.5,
    },
    {
        name: "2021",
        majorMunicipalFacilities: 10.72,
        minorMunicipalFacilities: 1.3,
        industrialFacilities: 0.54,
    },
    {
        name: "2022",
        majorMunicipalFacilities: 10.17,
        minorMunicipalFacilities: 1.3,
        industrialFacilities: 0.38,
    },
    {
        name: "2023",
        majorMunicipalFacilities: 9.86,
        minorMunicipalFacilities: 1.3,
        industrialFacilities: 0.22,
    },
    {
        name: "1 mg/L*",
        majorMunicipalFacilities: 6.1,
        minorMunicipalFacilities: 1.3,
        industrialFacilities: 0.4,
    },
    {
        name: "0.5 mg/L*",
        majorMunicipalFacilities: 3.0,
        minorMunicipalFacilities: 1.3,
        industrialFacilities: 0.4,
    },
];
const ps_bar_colors = {
    majorMunicipalFacilities: "#8884d8",
    minorMunicipalFacilities: "#82ca9d",
    industrialFacilities: "#ffc658",
};
const ps_reference_lines = [
    { value: 13.58, label: "25% Reduction" },
    { value: 9.96, label: "45% Reduction" },
];

// Pie Chart
const pie_data = [
    { name: "Category A", value: 400 },
    { name: "Category B", value: 300 },
    { name: "Category C", value: 200 },
    { name: "Category D", value: 100 },
];
const pie_colors = {
    "Category A": "#0088FE",
    "Category B": "#00C49F",
    "Category C": "#FFBB28",
    "Category D": "#FF8042",
};

// Line Chart
const line_data = [
    { name: "Jan", sales: 4000, revenue: 2400, profit: 1200 },
    { name: "Feb", sales: 3000, revenue: 1398, profit: 900 },
    { name: "Mar", sales: 2000, revenue: 9800, profit: 2800 },
    { name: "Apr", sales: 2780, revenue: 3908, profit: 1908 },
    { name: "May", sales: 1890, revenue: 4800, profit: 2300 },
    { name: "Jun", sales: 2390, revenue: 3800, profit: 2500 },
];

// Line configurations
const lines = [
    {
        dataKey: "sales",
        color: "#8884d8",
        strokeWidth: 2,
    },
    {
        dataKey: "revenue",
        color: "#82ca9d",
        strokeWidth: 2,
    },
    {
        dataKey: "profit",
        color: "#ffc658",
        strokeWidth: 2,
        dot: false, // Optional: disable dots for this line
    },
];
const ReportPage = () => {
    const chart = StackedBarChart({
        data: ps_data,
        width: 650,
        height: 400,
        barColors: ps_bar_colors,
        fontSize: 14,
        referenceLines: ps_reference_lines,
    });

    const pieChart = FilledPieChart({
        data: pie_data,
        width: "100%",
        height: 400,
        colors: pie_colors,
        fontSize: 14,
    });

    const lineChart = LineChart({
        data: line_data,
        lines: lines,
        width: "100%",
        height: 400,
        fontSize: 12,
    });

    const ps_ptg_text =
        "The total phosphorus loads since 2021 have decreased below the interim 25% reduction goal set for 2025. \n" +
        "Facilities are continually optimizing processes to reduce nutrient losses. Further nutrient loss reductions are anticipated when all facilities achieve lower phosphorus discharge limits of 1.0 mg/L and, eventually, 0.5 mg/L. Eventually, point source sector nutrient losses will be well below the overall, long-term goal of a 45% reduction in phosphorus losses. \n";

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" gutterBottom align="center" sx={{ my: 4 }}>
                Point Sources Report
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Progress Toward Goals
                </Typography>
                <TextDisplay
                    text={ps_ptg_text}
                    additionalComponent={chart}
                    truncate={true}
                    componentPosition="left"
                />
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Progress Toward Goals
                </Typography>
                <TextDisplay
                    text={ps_ptg_text}
                    additionalComponent={pieChart}
                    truncate={true}
                    componentPosition="right"
                />
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Progress Toward Goals
                </Typography>
                <TextDisplay
                    text={ps_ptg_text}
                    additionalComponent={lineChart}
                    truncate={true}
                    componentPosition="right"
                />
            </Box>
        </Container>
    );
};

export default ReportPage;
