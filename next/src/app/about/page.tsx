import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NextLink from 'next/link';

import fetchContentType from '@/lib/strapi/fetchContentType';
import RichContentViewer from '@/components/RichComponentViewer';
import FilledPieChart from '@/components/charts/FilledPieChart';
import StackedBarChart from '@/components/charts/StackedBarChart';
import LineChart from '@/components/charts/LineChart';
import DualChart from '@/components/charts/DualChart';

export default async function About() {
    const pageData = await fetchContentType('test', ``, true);
    const pieChart = pageData?.pie_chart;
    const stackedBarChart = pageData?.stacked_bar_chart;
    const lineChart = pageData?.line_chart;
    const dualChart = pageData?.dual_chart;

    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    Material UI - Next.js example in TypeScript
                </Typography>
                <Box sx={{ maxWidth: 'sm' }}>
                    <Button variant="contained" component={NextLink} href="/">
                        Go to the home page
                    </Button>
                </Box>
                <Box>
                    <RichContentViewer content={pageData?.ck_editor} />
                    <FilledPieChart
                        chart_data={pieChart?.chartData}
                        chart_colors={pieChart?.chartColors}
                        heading={pieChart?.heading}
                        subheading={pieChart?.subheading}
                    />
                    <StackedBarChart
                        chartData={stackedBarChart?.chartData}
                        chartReferenceLines={
                            stackedBarChart?.chartReferenceLines
                        }
                        chartColors={stackedBarChart?.chartColors}
                        heading={stackedBarChart?.heading}
                        subheading={stackedBarChart?.subheading}
                    />
                    <LineChart
                        chartData={lineChart?.chartData}
                        chartConfig={lineChart?.chartConfig}
                        heading={lineChart?.heading}
                        subheading={lineChart?.subheading}
                    />
                    <DualChart
                        left_chart={dualChart?.leftChart}
                        right_chart={dualChart?.rightChart}
                    />
                </Box>
            </Box>
        </Container>
    );
}
