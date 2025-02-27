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
    const [openSections, setOpenSections] = React.useState<Set<string>>(
        new Set()
    );
    const [sidebarHeight, setSidebarHeight] = React.useState<string>(
        'calc(100vh - 110px)'
    );
    const sidebarRef = React.useRef<HTMLDivElement>(null);
    const activeSectionRef = React.useRef<Record<string, HTMLElement | null>>(
        {}
    );

    // Effect to handle footer position and adjust sidebar height
    React.useEffect(() => {
        const updateSidebarHeight = () => {
            const footer = document.querySelector('.footer-container');
            if (!footer || !sidebarRef.current) return;

            const footerRect = footer.getBoundingClientRect();
            const navbarHeight = 110; // Height of the navbar
            const viewportHeight = window.innerHeight;

            // Check if footer is in the viewport
            const isFooterVisible = footerRect.top < viewportHeight;

            if (isFooterVisible) {
                // Calculate the available height when footer is visible
                const availableHeight = footerRect.top - navbarHeight;
                setSidebarHeight(`${availableHeight}px`);
            } else {
                // Use the default height when footer is not visible
                setSidebarHeight('calc(100vh - 110px)');
            }
        };

        // Initial update
        updateSidebarHeight();

        // Set up ResizeObserver to detect changes in the footer position
        const resizeObserver = new ResizeObserver(updateSidebarHeight);
        const footer = document.querySelector('.footer-container');
        if (footer) {
            resizeObserver.observe(footer);
        }

        // Also listen for scroll events as they can change the relative position
        window.addEventListener('scroll', updateSidebarHeight);
        window.addEventListener('resize', updateSidebarHeight);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('scroll', updateSidebarHeight);
            window.removeEventListener('resize', updateSidebarHeight);
        };
    }, []);

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
            const scrollPosition = window.scrollY + 120;

            // Check both top-level sections and subsections
            let foundActiveSection = false;

            // First check if we're in a subsection
            for (const section of sections) {
                // Check children first (subsections)
                for (const childSection of section.children) {
                    if (
                        scrollPosition >= childSection.start &&
                        scrollPosition < childSection.end
                    ) {
                        setActiveSection(childSection.id);
                        // Ensure parent section is expanded when subsection is active
                        setOpenSections((prev) => {
                            const newSet = new Set(prev);
                            newSet.add(section.id);
                            return newSet;
                        });
                        foundActiveSection = true;
                        break;
                    }
                }

                if (foundActiveSection) break;

                // Then check parent section
                if (
                    scrollPosition >= section.start &&
                    scrollPosition < section.end
                ) {
                    setActiveSection(section.id);
                    foundActiveSection = true;
                    break;
                }
            }

            // If no section is found active, could optionally clear the active section
            if (!foundActiveSection) {
                setActiveSection('');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    // Add effect to scroll active section into view when it changes
    React.useEffect(() => {
        if (
            activeSection &&
            activeSectionRef.current[activeSection] &&
            sidebarRef.current
        ) {
            // Use scrollIntoView with options for smooth scrolling within the sidebar
            // Add a small delay to ensure the sidebar height has been updated
            const timeoutId = setTimeout(() => {
                if (activeSectionRef.current[activeSection]) {
                    activeSectionRef.current[activeSection].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                    });
                }
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [activeSection, sidebarHeight]);

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
            ref={sidebarRef}
            sx={{
                width: 240,
                position: 'sticky',
                top: 110,
                height: sidebarHeight, // Use dynamic height
                maxHeight: 'calc(100vh - 110px)',
                overflowY: 'auto',
                backgroundColor: '#003D6D',
                borderRight: `1px solid ${theme.palette.divider}`,
                scrollbarWidth: 'thin',
                scrollbarColor: '#4AA6DC #003D6D',
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#003D6D',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#4AA6DC',
                    borderRadius: '4px',
                },
                '@media print': {
                    display: 'none',
                },
            }}
        >
            <List component="nav">
                {sections.map((section, index) => (
                    <React.Fragment key={section.id}>
                        <ListItemButton
                            ref={(el) => {
                                activeSectionRef.current[section.id] = el;
                            }}
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
                                            ref={(el) => {
                                                activeSectionRef.current[
                                                    childSection.id
                                                ] = el;
                                            }}
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
                                                primary={childSection.title.replace(
                                                    '#',
                                                    ''
                                                )}
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
