import Image from 'next/image';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface FullSpanImageProps {
    image: any;
    caption: string;
    baseImageUrl?: string;
    imageWidth?: number;
}
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        my: 2,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    caption: {
        fontSize: '16px',
        color: '#0A3977',
        textAlign: 'left',
        fontStyle: 'italic',
    },
};

export const FullSpanImage: React.FC<FullSpanImageProps> = ({
    image,
    caption,
    baseImageUrl = process.env.CMS_API_URL,
    imageWidth = 75,
}) => {
    const imageUrl = image.url ? `${baseImageUrl}${image.url}` : '';

    let boldCaption = '';
    let regularCaption = '';

    // Break caption along colon, everything before colon is bold
    if (caption) {
        const captionParts = caption.split(':');
        boldCaption = captionParts[0];
        regularCaption = captionParts[1];
    }

    return (
        <Box sx={{ ...styles.container, position: 'relative', height: 'auto' }}>
            <div
                style={{ width: '100%', height: 'auto', position: 'relative' }}
            >
                <img
                    src={imageUrl}
                    alt={image.alternativeText}
                    style={{
                        objectFit: 'contain',
                        width: `${imageWidth}%`,
                        height: 'auto',
                    }}
                />
            </div>
            {caption && (
                <Typography sx={styles.caption}>
                    <strong>{boldCaption}:</strong>
                    {regularCaption}
                </Typography>
            )}
        </Box>
    );
};
