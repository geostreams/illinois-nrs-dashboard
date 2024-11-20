import { Box, Typography } from '@mui/material';

const ImageSection: React.FC<ImageSectionProps> = ({
    title,
    alignment,
    width,
    imageUrl,
    altText
}) => {
    return (
        <Box
            sx={{
                width: width === 'full' ? '100%' : width === 'half' ? '48%' : '31%',
                textAlign: alignment,
                padding: 3,
                backgroundColor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1,
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
            >
                {title}
            </Typography>
            <Box
                component="img"
                src={imageUrl}
                alt={altText}
                sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 1,
                    marginTop: 2,
                }}
            />
        </Box>
    );
};

export default ImageSection;
