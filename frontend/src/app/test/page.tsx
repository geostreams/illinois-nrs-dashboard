import { Box, Container } from '@mui/material';
import SectionRenderer from '@/app/ui/sections/SectionRenderer';

export default function HomePage() {
    // Example sections data
    const sections = [
        {
            __component: 'sections.text-section',
            base: {
                title: 'Welcome to Our Analytics',
                alignment: 'left',
                width: 'full'
            },
            content: [
                {
                    type: 'paragraph',
                    children: [
                        {
                            type: 'text',
                            text: 'Welcome to our analytics dashboard.'
                        }
                    ]
                },
                {
                    type: 'heading',
                    level: 2,
                    children: [
                        {
                            type: 'text',
                            text: 'Key Features'
                        }
                    ]
                },
                {
                    type: 'list',
                    format: 'unordered',
                    children: [
                        {
                            type: 'listItem',
                            children: [
                                {
                                    type: 'text',
                                    text: 'Real-time data visualization'
                                }
                            ]
                        },
                        {
                            type: 'listItem',
                            children: [
                                {
                                    type: 'text',
                                    text: 'Interactive charts'
                                }
                            ]
                        },
                        {
                            type: 'listItem',
                            children: [
                                {
                                    type: 'text',
                                    text: 'Customizable views'
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'quote',
                    children: [
                        {
                            type: 'text',
                            text: 'Data is the new oil of the digital economy.'
                        }
                    ]
                }
            ]
        },
        {
            __component: 'sections.chart-section',
            base: {
                title: 'Monthly Revenue',
                alignment: 'center',
                width: 'half'
            },
            chartType: 'line',
            chartData: [
                { name: 'Jan', revenue: 4000, users: 2400 },
                { name: 'Feb', revenue: 3000, users: 1398 },
                { name: 'Mar', revenue: 2000, users: 9800 },
                { name: 'Apr', revenue: 2780, users: 3908 },
                { name: 'May', revenue: 1890, users: 4800 }
            ],
            chartColors: {
                revenue: '#8884d8',
                users: '#82ca9d'
            }
        },
        {
            __component: 'sections.chart-section',
            base: {
                title: 'User Distribution',
                alignment: 'center',
                width: 'half'
            },
            chartType: 'pie',
            chartData: [
                { name: 'Mobile', value: 400 },
                { name: 'Desktop', value: 300 },
                { name: 'Tablet', value: 300 }
            ],
            chartColors: {
                Mobile: '#0088FE',
                Desktop: '#00C49F',
                Tablet: '#FFBB28'
            }
        },
        {
            __component: 'sections.chart-section',
            base: {
                title: 'Quarterly Performance',
                alignment: 'center',
                width: 'full'
            },
            chartType: 'bar',
            chartData: [
                { name: 'Q1', sales: 400, profit: 240 },
                { name: 'Q2', sales: 300, profit: 139 },
                { name: 'Q3', sales: 200, profit: 980 }
            ],
            chartColors: {
                sales: '#8884d8',
                profit: '#82ca9d'
            }
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <SectionRenderer sections={sections} />
        </Container>
    );
}
