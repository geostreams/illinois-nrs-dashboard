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
    const [maxHeight, setMaxHeight] = React.useState('calc(100vh - 110px)');

    React.useEffect(() => {
        const updateSidebarHeight = () => {
            const footer = document.querySelector('.footer-container');
            if (footer) {
                const footerTop = footer.getBoundingClientRect().top;
                const sidebarTop = 110; // Navbar height
                const newHeight = footerTop - sidebarTop;
                setMaxHeight(`${newHeight}px`);
            } else {
                setMaxHeight('calc(100vh - 110px)');
            }
        };

        updateSidebarHeight();
        window.addEventListener('scroll', updateSidebarHeight);
        window.addEventListener('resize', updateSidebarHeight);

        return () => {
            window.removeEventListener('scroll', updateSidebarHeight);
            window.removeEventListener('resize', updateSidebarHeight);
        };
    }, []);

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
            const offset = 110; // To offset the navbar height
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
            const offset = 110; // To offset the navbar height
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
                height: maxHeight,
                overflowY: 'auto',
                backgroundColor: '#003D6D',
                borderRight: `1px solid ${theme.palette.divider}`,
                transition: 'height 0.2s ease-out',
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
                                backgroundColor: '#4AA6DC',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#4AA6DC',
                                },
                            },
                            '&:hover': {
                                backgroundColor: '#4AA6DC',
                            },
                        }}
                    >
                        <ListItemText
                            primary={heading}
                            sx={{
                                fontSize: '0.9rem',
                                color: 'white',
                                fontWeight: '100',
                            }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
};
