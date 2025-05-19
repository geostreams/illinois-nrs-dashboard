import { Card, CardContent, Typography, Box, Container } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

export default function InteractiveMapsPage() {
    console.log('InteractiveMapsPage');
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
                        <ConstructionIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
                        <Typography variant="h4" component="h1" gutterBottom>
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
