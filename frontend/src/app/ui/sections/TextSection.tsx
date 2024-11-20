// components/sections/TextSection.tsx
'use client';

import { Box, Typography } from '@mui/material';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

const blockRenderers = {
    paragraph: ({ children }) => (
        <Typography>{children}</Typography>
    ),
    heading: ({ children, level }) => {
        const variant = `h${level + 1}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        return (
            <Typography variant={variant} gutterBottom>
                {children}
            </Typography>
        );
    },
    list: ({ children, format }) => (
        <Box component={format === 'ordered' ? 'ol' : 'ul'} sx={{ pl: 3, mb: 2 }}>
            {children}
        </Box>
    ),
    listItem: ({ children }) => (
        <Typography component="li" sx={{ mb: 1 }}>
            {children}
        </Typography>
    ),
    quote: ({ children }) => (
        <Box
            component="blockquote"
            sx={{
                borderLeft: 4,
                borderColor: 'primary.main',
                pl: 2,
                py: 1,
                my: 2,
                fontStyle: 'italic'
            }}
        >
            <Typography>{children}</Typography>
        </Box>
    )
};

const TextSection: React.FC<TextSectionProps> = ({
    title,
    alignment,
    width,
    content
}) => {
    return (
        <>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ color: 'primary.main' }}
            >
                {title}
            </Typography>
            <Box sx={{ textAlign: 'left' }}>
                <BlocksRenderer
                    content={content}
                    blocks={blockRenderers}
                />
            </Box>
        </>
    );
};

export default TextSection;
