'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface Section {
    id: string;
    title: string;
    element: HTMLElement;
    start: number;
    end: number;
    level: number;
    children: Section[];
}

export const Sidebar: React.FC = () => {
    const theme = useTheme();
    const [activeSection, setActiveSection] = React.useState<string>('');
    const [sections, setSections] = React.useState<Section[]>([]);
    const [maxHeight, setMaxHeight] = React.useState('calc(100vh - 110px)');
    const [openSections, setOpenSections] = React.useState<Set<string>>(
        new Set()
    );

    // Modified section creation logic
    React.useEffect(() => {
        const createSections = () => {
            const headingElements = Array.from(
                document.querySelectorAll('h2, h3')
            );

            let currentH2Section: Section | null = null;
            const topLevelSections: Section[] = [];

            headingElements.forEach((heading, index) => {
                const nextHeading = headingElements[index + 1];
                const id = `section-${index}`;
                const headingElement = heading as HTMLElement;
                const level = headingElement.tagName === 'H2' ? 2 : 3;

                if (!headingElement.id) {
                    headingElement.id = id;
                }

                const start =
                    headingElement.getBoundingClientRect().top + window.scrollY;
                const end = nextHeading
                    ? (nextHeading as HTMLElement).getBoundingClientRect().top +
                      window.scrollY
                    : document.documentElement.scrollHeight;

                const section: Section = {
                    id,
                    title: headingElement.textContent || '',
                    element: headingElement,
                    start,
                    end,
                    level,
                    children: [],
                };

                if (level === 2) {
                    currentH2Section = section;
                    topLevelSections.push(section);
                } else if (level === 3 && currentH2Section) {
                    currentH2Section.children.push(section);
                }
            });

            setSections(topLevelSections);
        };

        createSections();
        const observer = new MutationObserver(createSections);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    // Handle scroll and update active section
    React.useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 140; // Account for navbar offset

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

    const handleClick = (sectionId: string, hasChildren: boolean) => {
        const section = findSection(sections, sectionId);
        if (section) {
            const offset = 110;
            window.scrollTo({
                top: section.start - offset,
                behavior: 'smooth',
            });
            setActiveSection(sectionId);

            // Toggle accordion if section has children
            if (hasChildren) {
                setOpenSections((prev) => {
                    const newSet = new Set(prev);
                    if (newSet.has(sectionId)) {
                        newSet.delete(sectionId);
                    } else {
                        newSet.add(sectionId);
                    }
                    return newSet;
                });
            }
        }
    };

    // Helper function to find a section by ID
    const findSection = (sections: Section[], id: string): Section | null => {
        for (const section of sections) {
            if (section.id === id) return section;
            for (const child of section.children) {
                if (child.id === id) return child;
            }
        }
        return null;
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
                '@media print': {
                    display: 'none',
                },
            }}
        >
            <List component="nav">
                {sections.map((section, index) => (
                    <React.Fragment key={section.id}>
                        <ListItemButton
                            selected={activeSection === section.id}
                            onClick={() =>
                                handleClick(
                                    section.id,
                                    section.children.length > 0
                                )
                            }
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
                            {section.children.length > 0 &&
                                (openSections.has(section.id) ? (
                                    <ExpandLess sx={{ color: 'white' }} />
                                ) : (
                                    <ExpandMore sx={{ color: 'white' }} />
                                ))}
                        </ListItemButton>
                        {section.children.length > 0 && (
                            <Collapse
                                in={openSections.has(section.id)}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List component="div" disablePadding>
                                    {section.children.map((childSection) => (
                                        <ListItemButton
                                            key={childSection.id}
                                            selected={
                                                activeSection ===
                                                childSection.id
                                            }
                                            onClick={() =>
                                                handleClick(
                                                    childSection.id,
                                                    false
                                                )
                                            }
                                            sx={{
                                                pl: 4,
                                                '&.Mui-selected': {
                                                    backgroundColor: '#4AA6DC',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#4AA6DC',
                                                    },
                                                },
                                                '&:hover': {
                                                    backgroundColor: '#4AA6DC',
                                                },
                                            }}
                                        >
                                            <ListItemText
                                                primary={childSection.title}
                                                sx={{
                                                    fontSize: '0.85rem',
                                                    color: 'white',
                                                    fontWeight: '100',
                                                }}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                        {index < sections.length - 1 && (
                            <Divider sx={{ backgroundColor: 'white' }} />
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
};
