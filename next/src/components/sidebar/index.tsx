'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';

export const Sidebar: React.FC = () => {
    const theme = useTheme();
    const [activeHeading, setActiveHeading] = React.useState<string>('');
    const [headings, setHeadings] = React.useState<string[]>([]);

    React.useEffect(() => {
        const headingElements = Array.from(document.querySelectorAll('h1, h2'));
        const headingTexts = headingElements
            .map((h) => h.textContent || '')
            .filter(Boolean);
        setHeadings(headingTexts);
    }, []);

    const handleClick = (title: string) => {
        const headingElement = Array.from(
            document.querySelectorAll('h1, h2')
        ).find((h) => h.textContent?.trim() === title.trim());

        if (headingElement) {
            const offset = 140; // Adjust this to match your header/navbar height
            const elementPosition =
                headingElement.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth',
            });
            setActiveHeading(title);
        }
    };

    React.useEffect(() => {
        const handleScroll = () => {
            const offset = 140; // Same offset as in handleClick
            const headingElements = Array.from(
                document.querySelectorAll('h1, h2')
            );
            const currentHeading = headingElements.find((element) => {
                const rect = element.getBoundingClientRect();
                return rect.top <= offset && rect.bottom >= offset;
            });

            if (currentHeading) {
                setActiveHeading(currentHeading.textContent || '');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Box
            sx={{
                width: 240,
                position: 'fixed',
                top: 110,
                bottom: 0,
                overflowY: 'auto',
                backgroundColor: '#f5f5f5',
                borderRight: `1px solid ${theme.palette.divider}`,
            }}
        >
            <List component="nav">
                {headings.map((heading, index) => (
                    <ListItemButton
                        key={`${heading}-${index}`}
                        selected={activeHeading === heading}
                        onClick={() => handleClick(heading)}
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: '#0C457B',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#0C457B',
                                },
                            },
                            '&:hover': {
                                backgroundColor: 'rgba(12, 69, 123, 0.08)',
                            },
                        }}
                    >
                        <ListItemText
                            primary={heading}
                            primaryTypographyProps={{
                                fontSize: '0.9rem',
                                fontWeight:
                                    activeHeading === heading
                                        ? 'bold'
                                        : 'normal',
                            }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
};
