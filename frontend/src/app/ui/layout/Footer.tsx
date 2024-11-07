import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Footer: React.FC = () => {
    return (
        <Box component="footer" sx={{ bgcolor: "background.paper", py: 6 }}>
            <Container maxWidth="lg">
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                >
                    © {new Date().getFullYear()} My React App. All rights
                    reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
