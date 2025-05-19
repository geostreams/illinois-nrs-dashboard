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
    const [openSections, setOpenSections] = React.useState<Set<string>>(new Set());
    const sidebarRef = React.useRef<HTMLDivElement>(null);
    const activeSectionRef = React.useRef<Record<string, HTMLElement | null>>({});

    React.useEffect(() => {
        const createSections = () => {
            const headingElements = Array.from(document.querySelectorAll('h2, h3')).filter((heading) => {
                const parentDiv = heading.closest('div[hidden-in-sidebar]');
                return !parentDiv || parentDiv.getAttribute('hidden-in-sidebar') !== 'true';
            });

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

                const start = headingElement.getBoundingClientRect().top + window.scrollY;
                const end = nextHeading
                    ? (nextHeading as HTMLElement).getBoundingClientRect().top + window.scrollY
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

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 120 + 200;
            let foundActiveSection = false;

            for (const section of sections) {
                for (const childSection of section.children) {
                    if (scrollPosition >= childSection.start && scrollPosition < childSection.end) {
                        setActiveSection(childSection.id);
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

                if (scrollPosition >= section.start && scrollPosition < section.end) {
                    setActiveSection(section.id);
                    foundActiveSection = true;
                    break;
                }
            }

            if (!foundActiveSection) {
                setActiveSection('');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    const handleClick = (sectionId: string) => {
        const section = findSection(sections, sectionId);
        if (section) {
            const offset = 110;
            window.scrollTo({
                top: section.start - offset,
                behavior: 'smooth',
            });
            setActiveSection(sectionId);
        }
    };

    const handleToggleExpand = (event: React.MouseEvent, sectionId: string) => {
        event.stopPropagation();
        setOpenSections((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            return newSet;
        });
    };

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
                position: 'sticky',
                top: 110,
                width: 240,
                height: '100%',
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
            <List
                component="nav"
                sx={{
                    padding: 0,
                    '& .MuiListItemButton-root': {
                        borderRadius: 0,
                    },
                }}
            >
                {sections.map((section, index) => (
                    <React.Fragment key={section.id}>
                        <ListItemButton
                            ref={(el) => {
                                activeSectionRef.current[section.id] = el;
                            }}
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
                            {section.children.length > 0 && (
                                <Box
                                    component="span"
                                    onClick={(e) => handleToggleExpand(e, section.id)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {openSections.has(section.id) ? (
                                        <ExpandLess sx={{ color: 'white' }} />
                                    ) : (
                                        <ExpandMore sx={{ color: 'white' }} />
                                    )}
                                </Box>
                            )}
                        </ListItemButton>
                        {section.children.length > 0 && (
                            <Collapse in={openSections.has(section.id)} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {section.children.map((childSection) => (
                                        <ListItemButton
                                            key={childSection.id}
                                            ref={(el) => {
                                                activeSectionRef.current[childSection.id] = el;
                                            }}
                                            selected={activeSection === childSection.id}
                                            onClick={() => handleClick(childSection.id)}
                                            sx={{
                                                pl: 4,
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
                                                primary={childSection.title.replace('#', '')}
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
                        {index < sections.length - 1 && <Divider sx={{ backgroundColor: 'white' }} />}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
};
