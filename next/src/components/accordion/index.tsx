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

    // Handle URL hash navigation to headings inside accordion panels
    // The focus is have a delay to ensure the DOM is ready
    useEffect(() => {
        const handleHashNavigation = () => {
            const hash = window.location.hash.slice(1); // Remove the # symbol
            if (hash && accordionItems.length > 0) {
                // Small delay to ensure DOM is ready
                setTimeout(() => {
                    const targetElement = document.getElementById(hash);
                    if (targetElement) {
                        // Find the accordion panel that contains this heading
                        const accordionDetails = targetElement.closest('.MuiAccordionDetails-root');
                        if (accordionDetails) {
                            const accordionElement = accordionDetails.closest('.MuiAccordion-root');
                            if (accordionElement) {
                                // Find the accordion item ID from the accordion summary
                                const accordionSummary = accordionElement.querySelector('.MuiAccordionSummary-root');
                                if (accordionSummary) {
                                    const summaryId = accordionSummary.id;
                                    // Extract item ID from summary ID (format: accordion-header-{itemId})
                                    const itemId = summaryId.replace('accordion-header-', '');

                                    // Expand the accordion panel containing the target heading
                                    setExpandedItems((prev) => {
                                        const newSet = new Set(prev);
                                        newSet.add(itemId);
                                        return newSet;
                                    });

                                    // Scroll to the heading after a brief delay to allow expansion
                                    setTimeout(() => {
                                        targetElement.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start',
                                        });
                                    }, 200);
                                }
                            }
                        }
                    }
                }, 100);
            }
        };

        // Handle initial load hash
        handleHashNavigation();

        // Handle hash changes (when user clicks anchor links)
        window.addEventListener('hashchange', handleHashNavigation);

        return () => {
            window.removeEventListener('hashchange', handleHashNavigation);
        };
    }, [accordionItems]);

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
