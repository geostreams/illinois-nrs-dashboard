'use client';

import React from 'react';
import { Typography, Box, Container } from "@mui/material";
import TextDisplay from "@/app/ui/TextDisplay";
import StackedBarChart from "@/app/ui/charts/StackedBarChart";
import FilledPieChart from "@/app/ui/charts/FilledPieChart";
import LineChart from "@/app/ui/charts/LineChart";

// Define types for the data structures
interface PointSourceData {
    name: string;
    majorMunicipalFacilities: number;
    minorMunicipalFacilities: number;
    industrialFacilities: number;
}

interface PieData {
    name: string;
    value: number;
}

interface LineData {
    name: string;
    sales: number;
    revenue: number;
    profit: number;
}

interface LineConfig {
    dataKey: string;
    color: string;
    strokeWidth: number;
    dot?: boolean;
}

// Point Source Data
const ps_data: PointSourceData[] = [
    {
        name: "2011",
        majorMunicipalFacilities: 16.7,
        minorMunicipalFacilities: 1.3,
        industrialFacilities: 0.1,
    },
    // ... rest of your data
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

// Pie Chart Data
const pie_data: PieData[] = [
    { name: "Category A", value: 400 },
    { name: "Category B", value: 300 },
    { name: "Category C", value: 200 },
    { name: "Category D", value: 100 },
];

const pie_colors: Record<string, string> = {
    "Category A": "#0088FE",
    "Category B": "#00C49F",
    "Category C": "#FFBB28",
    "Category D": "#FF8042",
};

// Line Chart Data
const line_data: LineData[] = [
    { name: "Jan", sales: 4000, revenue: 2400, profit: 1200 },
    // ... rest of your data
];

const lines: LineConfig[] = [
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
        dot: false,
    },
];

export default function PointSourcePage(){
    // Text content
    const ps_ptg_text = `The total phosphorus loads since 2021 have decreased below the interim 25% reduction goal set for 2025.
        Facilities are continually optimizing processes to reduce nutrient losses. Further nutrient loss reductions are anticipated when all facilities achieve lower phosphorus discharge limits of 1.0 mg/L and, eventually, 0.5 mg/L. Eventually, point source sector nutrient losses will be well below the overall, long-term goal of a 45% reduction in phosphorus losses.`;

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
                    additionalComponent={
                        <StackedBarChart
                            data={ps_data}
                            width={650}
                            height={400}
                            barColors={ps_bar_colors}
                            fontSize={14}
                            referenceLines={ps_reference_lines}
                        />
                    }
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
                    additionalComponent={
                        <FilledPieChart
                            data={pie_data}
                            width="100%"
                            height={400}
                            colors={pie_colors}
                            fontSize={14}
                        />
                    }
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
                    additionalComponent={
                        <LineChart
                            data={line_data}
                            lines={lines}
                            width="100%"
                            height={400}
                            fontSize={12}
                        />
                    }
                    truncate={true}
                    componentPosition="right"
                />
            </Box>
        </Container>
    );
};
