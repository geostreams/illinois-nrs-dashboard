import { useState } from "react";
import { Grid, Typography, Link, Box } from "@mui/material";

// The component takes in text and an optional additional component to display alongside the text.
// TODO: we should hard code maxChars to a reasonable value so we dont need to trouble with it in the future
const TextDisplay = ({
    text,
    additionalComponent,
    truncate = false,
    componentPosition = "right",
    maxChars = 100,
}) => {
    const [showFullText, setShowFullText] = useState(!truncate);

    const truncatedText =
        truncate && text.length > maxChars
            ? `${text.slice(0, maxChars)}...`
            : text;

    const handleToggleText = () => {
        setShowFullText(!showFullText);
    };

    const textContent = (
        <Box>
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

    if (!additionalComponent) {
        return (
            <Grid container={true} spacing={2} alignItems="stretch">
                <Grid item xs={12}>
                    {textContent}
                </Grid>
            </Grid>
        );
    }

    const additionalContent = additionalComponent && (
        <Box sx={{ width: "100%", height: "100%", minHeight: 300 }}>
            {additionalComponent}
        </Box>
    );

    return (
        <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} md={componentPosition === "right" ? 5 : 7}>
                {componentPosition === "left" ? additionalContent : textContent}
            </Grid>
            <Grid item xs={12} md={componentPosition === "right" ? 7 : 5}>
                {componentPosition === "right"
                    ? additionalContent
                    : textContent}
            </Grid>
        </Grid>
    );
};

export default TextDisplay;
