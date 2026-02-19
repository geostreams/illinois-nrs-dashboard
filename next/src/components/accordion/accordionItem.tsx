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
    border: 'none',
    borderLeft: '1px solid #ccc',
    borderRight: '1px solid #ccc',
    borderRadius: 0,
    // Only first item gets top border and top border radius
    ...(isFirst && {
        borderTop: '1px solid #ccc',
        borderTopLeftRadius: '7px',
        borderTopRightRadius: '7px',
    }),
    // Only last item gets bottom border and bottom border radius
    ...(isLast && {
        borderBottom: '1px solid #ccc',
        borderBottomLeftRadius: '7px',
        borderBottomRightRadius: '7px',
    }),
    '&:before': {
        display: 'none',
    },
    // Remove MUI's default margin behavior for expanded accordions
    '&.Mui-expanded': {
        margin: 0,
        // Add bottom border for expanded sections (except last item)
        ...(!isLast && {
            borderBottom: '1px solid #ccc',
        }),
    },
}));

export const AccordionItem: React.FC<AccordionItemProps> = ({ item, isFirst, isLast, expanded, onToggle }) => {
    return (
        <StyledAccordion expanded={expanded} onChange={onToggle} isFirst={isFirst} isLast={isLast}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`accordion-panel-${item.documentId}`}
                id={`accordion-header-${item.documentId}`}
                sx={{
                    borderBottom: '1px solid #ccc',
                }}
            >
                <Typography
                    variant="h4"
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
