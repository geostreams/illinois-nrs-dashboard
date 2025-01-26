'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';

interface Section {
    id: string;
    title: string;
    element: HTMLElement;
    start: number;
    end: number;
}

export const Sidebar: React.FC = () => {
    const theme = useTheme();
    const [activeSection, setActiveSection] = React.useState<string>('');
    const [sections, setSections] = React.useState<Section[]>([]);
    const [maxHeight, setMaxHeight] = React.useState('calc(100vh - 110px)');

    // Create sections based on headings
    React.useEffect(() => {
        const createSections = () => {
            const headingElements = Array.from(
                document.querySelectorAll('h1, h2')
            );
            const newSections: Section[] = headingElements.map(
                (heading, index) => {
                    const nextHeading = headingElements[index + 1];
                    const id = `section-${index}`;

                    // Add id to heading if it doesn't exist
                    if (!heading.id) {
                        heading.id = id;
                    }

                    // Calculate section boundaries
                    const start =
                        heading.getBoundingClientRect().top + window.scrollY;
                    const end = nextHeading
                        ? nextHeading.getBoundingClientRect().top +
                          window.scrollY
                        : document.documentElement.scrollHeight;

                    return {
                        id,
                        title: heading.textContent || '',
                        element: heading,
                        start,
                        end,
                    };
                }
            );

            setSections(newSections);
        };

        createSections();
        // Recalculate sections when content changes
        const observer = new MutationObserver(createSections);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    // Handle scroll and update active section
    React.useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150; // Account for navbar offset

            // Find the current section
            const currentSection = sections.find(
                (section) =>
                    scrollPosition >= section.start &&
                    scrollPosition < section.end
            );

            if (currentSection) {
                setActiveSection(currentSection.id);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    // Handle sidebar height
    React.useEffect(() => {
        const updateSidebarHeight = () => {
            const footer = document.querySelector('.footer-container');
            if (footer) {
                const footerTop = footer.getBoundingClientRect().top;
                const sidebarTop = 110;
                const newHeight = footerTop - sidebarTop;
                setMaxHeight(`${newHeight}px`);
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

    const handleClick = (sectionId: string) => {
        const section = sections.find((s) => s.id === sectionId);
        if (section) {
            const offset = 110;
            window.scrollTo({
                top: section.start - offset,
                behavior: 'smooth',
            });
            setActiveSection(sectionId);
        }
    };

    return (
        <Box
            sx={{
                width: 240,
                position: 'fixed',
                top: 110,
                left: 0,
                bottom: 0,
                height: maxHeight,
                overflowY: 'auto',
                backgroundColor: '#003D6D',
                borderRight: `1px solid ${theme.palette.divider}`,
            }}
        >
            <List component="nav">
                {sections.map((section, index) => (
                    <React.Fragment key={section.id}>
                        <ListItemButton
                            selected={activeSection === section.id}
                            onClick={() => handleClick(section.id)}
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
                                primary={section.title}
                                sx={{
                                    fontSize: '0.9rem',
                                    color: 'white',
                                    fontWeight: '100',
                                }}
                            />
                        </ListItemButton>
                        {index < sections.length && (
                            <Divider sx={{ backgroundColor: 'white' }} />
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
};
