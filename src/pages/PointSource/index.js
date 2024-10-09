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
        width: 600,
        height: 400,
        barColors: ps_bar_colors,
        fontSize: 9,
        referenceLines: ps_reference_lines,
    });

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom align="center" sx={{ my: 4 }}>
                Annual Performance Report
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Overview
                </Typography>
                <TextDisplay
                    text="This report provides an overview of our company's performance over the past year. We've seen significant growth in several key areas, despite facing challenges in the global market. As we can see from the chart, our performance has been volatile but generally trending upward. The peak in March represents our successful product launch, while the dip in May reflects the temporary setback due to supply chain issues. Despite these fluctuations, we've managed to maintain a strong overall growth trajectory, which positions us well for the coming year. Our team's resilience and adaptability have been key factors in navigating the complex business landscape and achieving these results."
                    additionalComponent={chart}
                    truncate={true}
                    componentPosition="right"
                />
                <Typography variant="body1" paragraph align="right">
                    As we can see from the chart above, our performance has been
                    volatile but generally trending upward. The peak in March
                    represents our successful product launch, while the dip in
                    May reflects the temporary setback due to supply chain
                    issues.
                </Typography>
            </Box>

            {/* Achievements Section */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h5" gutterBottom align="center">
                    Key Achievements
                </Typography>

                <Typography variant="body1" component="ul" align="left">
                    <li>
                        Launched 3 new product lines, expanding our market reach
                    </li>
                    <li>Increased customer satisfaction ratings by 15%</li>
                    <li>
                        Implemented cost-saving measures, resulting in a 10%
                        reduction in operational expenses
                    </li>
                </Typography>
            </Box>

            {/* Future Plans Section */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h5" gutterBottom align="center">
                    Future Plans
                </Typography>

                <Typography variant="body1" paragraph align="right">
                    Moving forward, we aim to capitalize on these successes and
                    address the challenges we've identified. Our focus for the
                    coming year will be on:
                </Typography>

                <Typography variant="body1" component="ul" align="left">
                    <li>Stabilizing our supply chain</li>
                    <li>Further expanding our product range</li>
                    <li>Investing in employee development programs</li>
                </Typography>
            </Box>
        </Container>
    );
};

export default ReportPage;
