import React, { useState } from "react";
import { Grid, Typography, Link, Box } from "@mui/material";
import { useScreenSize } from "../context/ScreenSizeContext";
// This component displays text content with an optional additional component, such as an image or chart.
// TODO: Maybe change hardcoded maxChars to a specific number
const TextDisplay = ({
    text,
    additionalComponent,
    truncate = false,
    componentPosition = "top",
    textComponentSize = { xs: 12, md: 5 },
    propComponentSize = { xs: 12, md: 7 },
}) => {
    const [showFullText, setShowFullText] = useState(!truncate);
    // Take screen size into account to adjust the max number of characters displayed.
    const { isSmallScreen } = useScreenSize();

    const maxChars = isSmallScreen ? 150 : 200;
    const truncatedText =
        truncate && text.length > maxChars
            ? `${text.slice(0, maxChars)}...`
            : text;

    const handleToggleText = () => {
        setShowFullText(!showFullText);
    };

    const textContent = (
        <Box sx={{ mb: isSmallScreen ? 2 : 0 }}>
            <Typography variant="body1">
                {showFullText ? text : truncatedText}
                {truncate && (
                    <Link
                        component="span"
                        onClick={handleToggleText}
                        sx={{ cursor: "pointer", color: "primary.main", ml: 1 }}
                    >
                        {showFullText ? "Show Less" : "Show More"}
                    </Link>
                )}
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
