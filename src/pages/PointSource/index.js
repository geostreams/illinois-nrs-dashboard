import React from 'react';
import { Typography, Box, Container } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TextDisplay from "../../components/TextDisplay";

const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
];

const ReportPage = () => {

    const chart = (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );

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
