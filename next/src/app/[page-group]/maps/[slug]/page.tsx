'use client';
import { Card, CardContent, Typography, Box, Container } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useParams } from 'next/navigation';

export default function InteractiveMapsPage() {
    const { slug } = useParams();
    let formattedTitle = '';
    // Convert slug from kebab-case to Title Case
    if (slug) {
        formattedTitle = String(slug)
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    py: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                }}
            >
                <Card sx={{ maxWidth: 600, width: '100%' }}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            p: 4,
                        }}
                    >
                        <Typography variant="h3" component="h1" gutterBottom>
                            {formattedTitle} Dashboard
                        </Typography>
                        <ConstructionIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
                        <Typography variant="h4" component="h2" gutterBottom>
                            Under Construction
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            This feature is currently under construction. Please check back later for updates.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
