import Image from 'next/image';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface FullSpanImageProps {
    image: any;
    caption: string;
    baseImageUrl?: string;
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
    baseImageUrl = process.env.NEXT_PUBLIC_CMS_API_URL,
}) => {
    const imageUrl = image.url ? `${baseImageUrl}${image.url}` : '';

    // Break caption along colon, everything before colon is bold
    const captionParts = caption.split(':');
    const boldCaption = captionParts[0];
    const regularCaption = captionParts[1];

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
                        width: '75%',
                        height: 'auto',
                    }}
                />
            </div>
            <Typography sx={styles.caption}>
                <strong>{boldCaption}:</strong>
                {regularCaption}
            </Typography>
        </Box>
    );
};
