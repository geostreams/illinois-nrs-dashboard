'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { AccordionItem } from './accordionItem';
import { AccordionItemData, AccordionProps } from './types';

export const Accordion: React.FC<AccordionProps> = ({ accordionGroupID }) => {
    const [accordionItems, setAccordionItems] = useState<AccordionItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchAccordionItems = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${process.env.CMS_API_URL}/api/accordion-items?filters[accordionGroup][$eq]=${accordionGroupID}`
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
                // Initialize all items as expanded (matching original defaultExpanded behavior)
                const initialExpandedItems = new Set<string>(
                    sortedItems.map((item: AccordionItemData) => item.documentId || item.id.toString())
                );
                setExpandedItems(initialExpandedItems);
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

    const handleToggleItem = (itemId: string) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const handleToggleAll = () => {
        const allExpanded = expandedItems.size === accordionItems.length;

        if (allExpanded) {
            // Collapse all
            setExpandedItems(new Set());
        } else {
            // Expand all
            const allItemIds = new Set<string>(accordionItems.map((item) => item.documentId || item.id.toString()));
            setExpandedItems(allItemIds);
        }
    };

    const allExpanded = expandedItems.size === accordionItems.length;

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
            {/* Header with expand/collapse all button */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '1rem',
                }}
            >
                <Button
                    onClick={handleToggleAll}
                    sx={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        '&:hover': {
                            backgroundColor: '#1565c0',
                        },
                    }}
                >
                    {allExpanded ? 'Collapse All' : 'Expand All'}
                </Button>
            </Box>

            {/* Accordion items */}
            <Box>
                {accordionItems.map((item, index) => (
                    <AccordionItem
                        key={item.documentId || item.id}
                        item={item}
                        isFirst={index === 0}
                        isLast={index === accordionItems.length - 1}
                        expanded={expandedItems.has(item.documentId || item.id.toString())}
                        onToggle={() => handleToggleItem(item.documentId || item.id.toString())}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default Accordion;
