'use client';

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ComponentRenderer } from '../PageContentGenerator/ComponentRenderer';
import { AccordionItemProps } from './types';

const StyledAccordion = styled(Accordion, {
    shouldForwardProp: (prop) => prop !== 'isFirst' && prop !== 'isLast',
})<{ isFirst: boolean; isLast: boolean }>(({ isFirst, isLast }) => ({
    boxShadow: 'none',
    border: '1px solid #ccc',
    borderRadius: 0,
    // First item gets top border radius
    ...(isFirst && {
        borderTopLeftRadius: '7px',
        borderTopRightRadius: '7px',
    }),
    // Last item gets bottom border radius
    ...(isLast && {
        borderBottomLeftRadius: '7px',
        borderBottomRightRadius: '7px',
    }),
    // Remove top border for non-first items to avoid double borders
    ...(!isFirst && {
        borderTop: 'none',
        marginTop: '-1px', // Overlap to create single border between items
    }),
    '&:before': {
        display: 'none',
    },
    '&.Mui-expanded': {
        margin: 0,
    },
}));

export const AccordionItem: React.FC<AccordionItemProps> = ({ item, isFirst, isLast }) => {
    return (
        <StyledAccordion defaultExpanded isFirst={isFirst} isLast={isLast}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`accordion-panel-${item.documentId}`}
                id={`accordion-header-${item.documentId}`}
                sx={{
                    borderBottom: '1px solid #ccc',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        display: 'block',
                        pointerEvents: 'none',
                        border: 'transparent 2px solid',
                        borderRadius: '5px',
                        padding: '0.25em',
                        outline: 'none',
                        fontFamily: "'Open Sans', sans-serif",
                        color: '#0A3977',
                        fontSize: '20px',
                        fontWeight: 600,
                    }}
                >
                    {item.title}
                </Typography>
            </AccordionSummary>

            <AccordionDetails>
                <Box>
                    {item.contents && item.contents.length > 0 ? (
                        item.contents.map((content, index) => (
                            <ComponentRenderer key={content.id || index} component={content} />
                        ))
                    ) : (
                        <Typography color="text.secondary" fontStyle="italic">
                            No content available for this section.
                        </Typography>
                    )}
                </Box>
            </AccordionDetails>
        </StyledAccordion>
    );
};
