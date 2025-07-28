'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { AccordionItem } from './accordionItem';
import { AccordionItemData, AccordionProps } from './types';

export const Accordion: React.FC<AccordionProps> = ({ accordionGroupID }) => {
    const [accordionItems, setAccordionItems] = useState<AccordionItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccordionItems = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/accordion-items?filters[accordionGroup][$eq]=${accordionGroupID}`
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch accordion items: ${response.status}`);
                }

                const data = await response.json();
                const items = data.data || [];

                // Sort accordion items by accordionOrder
                const sortedItems = items.sort((a: AccordionItemData, b: AccordionItemData) => {
                    return (a.accordionOrder || 0) - (b.accordionOrder || 0);
                });

                setAccordionItems(sortedItems);
            } catch (err) {
                console.error('Error fetching accordion items:', err);
                setError(err instanceof Error ? err.message : 'Failed to load accordion items');
            } finally {
                setLoading(false);
            }
        };

        if (accordionGroupID) {
            fetchAccordionItems();
        }
    }, [accordionGroupID]);

    if (loading) {
        return (
            <Box sx={{ padding: '2rem', textAlign: 'center' }}>
                <Typography>Loading accordion items...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ padding: '2rem', textAlign: 'center', color: 'error.main' }}>
                <Typography>Error loading accordion: {error}</Typography>
            </Box>
        );
    }

    if (!accordionItems.length) {
        return (
            <Box sx={{ padding: '2rem', textAlign: 'center' }}>
                <Typography>No accordion items found for group: {accordionGroupID}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {accordionItems.map((item, index) => (
                <AccordionItem
                    key={item.documentId || item.id}
                    item={item}
                    isFirst={index === 0}
                    isLast={index === accordionItems.length - 1}
                />
            ))}
        </Box>
    );
};

export default Accordion;
