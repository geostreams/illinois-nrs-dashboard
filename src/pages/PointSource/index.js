import React from "react";
import { Typography, Box, Container } from "@mui/material";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import TextDisplay from "../../components/TextDisplay";
import StackedBarChart from "../../components/charts/StackedBarChart";

const data = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
];

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
const ReportPage = () => {
    const chart = StackedBarChart({
        data: ps_data,
        width: 800,
        height: 400,
        barColors: ps_bar_colors,
        fontSize: 14,
        referenceLines: ps_reference_lines,
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
                    componentPosition="right"
                />
            </Box>
        </Container>
    );
};

export default ReportPage;
