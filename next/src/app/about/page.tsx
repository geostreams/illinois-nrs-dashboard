import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NextLink from 'next/link';

import fetchContentType from '@/lib/strapi/fetchContentType';
import RichContentViewer from '@/components/RichComponentViewer';
import FilledPieChart from '@/components/charts/FilledPieChart';

export default async function About() {
    const pageData = await fetchContentType('test', ``, true);
    const chart = pageData?.pie_chart;
    console.log(chart);

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
                        chart_data={chart?.chartData}
                        chart_colors={chart?.chartColors}
                        heading={chart?.heading}
                        subheading={chart?.subheading}
                    />
                </Box>
            </Box>
        </Container>
    );
}
