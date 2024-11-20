import React, { useState } from "react";
import { Grid, Typography, Link, Box } from "@mui/material";
import { useScreenSize } from "../context/ScreenSizeContext";

// Define types for the component props
type ComponentPosition = "top" | "bottom" | "left" | "right";
type GridSize = {
    xs: number;
    md: number;
};

interface TextDisplayProps {
    text: string;
    additionalComponent?: React.ReactNode;
    truncate?: boolean;
    componentPosition?: ComponentPosition;
    textComponentSize?: GridSize;
    propComponentSize?: GridSize;
}

const TextDisplay: React.FC<TextDisplayProps> = ({
    text,
    additionalComponent,
    componentPosition = "top",
    textComponentSize = { xs: 12, md: 5 },
    propComponentSize = { xs: 12, md: 7 },
}) => {
    const { isSmallScreen } = useScreenSize();


    const textContent = (
        <Box sx={{ mb: isSmallScreen ? 2 : 0 }}>
            <Typography variant="body1">
                {text}
            </Typography>
        </Box>
    );

    const additionalContent = additionalComponent && (
        <Box
            sx={{
                width: "100%",
                height: isSmallScreen ? 300 : 400,
                minHeight: 300,
            }}
        >
            {additionalComponent}
        </Box>
    );

    // Handle the layout if additional prop is not provided
    if (!additionalComponent) {
        return (
            <Grid
                container
                spacing={2}
                alignItems="stretch"
                direction={isSmallScreen ? "column" : "row"}
            >
                <Grid item xs={12}>
                    {textContent}
                </Grid>
            </Grid>
        );
    }

    switch (componentPosition) {
    case "top":
        return (
            <Grid
                container
                spacing={2}
                alignItems="stretch"
                direction="column"
            >
                <Grid item xs={12}>
                    {additionalContent}
                </Grid>
                <Grid item xs={12}>
                    {textContent}
                </Grid>
            </Grid>
        );
    case "bottom":
        return (
            <Grid
                container
                spacing={2}
                alignItems="stretch"
                direction="column"
            >
                <Grid item xs={12}>
                    {textContent}
                </Grid>
                <Grid item xs={12}>
                    {additionalContent}
                </Grid>
            </Grid>
        );

    case "left":
        return (
            <Grid
                container
                spacing={2}
                alignItems="stretch"
                direction={isSmallScreen ? "column" : "row"}
            >
                <Grid
                    item
                    xs={propComponentSize.xs}
                    md={propComponentSize.md}
                >
                    {additionalContent}
                </Grid>
                <Grid
                    item
                    xs={textComponentSize.xs}
                    md={textComponentSize.md}
                >
                    {textContent}
                </Grid>
            </Grid>
        );
    case "right":
    default:
        return (
            <Grid
                container
                spacing={2}
                alignItems="stretch"
                direction={isSmallScreen ? "column" : "row"}
            >
                <Grid
                    item
                    xs={textComponentSize.xs}
                    md={textComponentSize.md}
                >
                    {textContent}
                </Grid>
                <Grid
                    item
                    xs={propComponentSize.xs}
                    md={propComponentSize.md}
                >
                    {additionalContent}
                </Grid>
            </Grid>
        );
    }
};

export default TextDisplay;
