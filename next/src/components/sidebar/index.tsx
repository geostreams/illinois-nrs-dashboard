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

const NAVBAR_HEIGHT = 110;

export const Sidebar: React.FC = () => {
    const theme = useTheme();
    const [activeSection, setActiveSection] = React.useState<string>('');
    const [sections, setSections] = React.useState<Section[]>([]);
    const [openSections, setOpenSections] = React.useState<Set<string>>(new Set());
    const [alertHeight, setAlertHeight] = React.useState(0);
    const headerHeight = NAVBAR_HEIGHT + alertHeight + 10; // 10px padding for aesthetic purposes
    const sidebarRef = React.useRef<HTMLDivElement>(null);
    const activeSectionRef = React.useRef<Record<string, HTMLElement | null>>({});

    // Measure the alert banner height once after mount.
    // Delayed 350ms so the banner's useEffect and MUI Collapse animation (~300ms) finish first.
    React.useEffect(() => {
        const id = setTimeout(() => {
            const header = document.querySelector<HTMLElement>('[data-header-root]');
            if (header) {
                const extra = header.getBoundingClientRect().height - NAVBAR_HEIGHT;
                if (extra > 0) setAlertHeight(extra);
            }
        }, 350);
        return () => clearTimeout(id);
    }, []);

    // Reset alert height when the banner is dismissed (after its close animation finishes).
    React.useEffect(() => {
        const handleAlertClosed = () => {
            setTimeout(() => setAlertHeight(0), 350);
        };
        window.addEventListener('maintenance-alert-closed', handleAlertClosed);
        return () => window.removeEventListener('maintenance-alert-closed', handleAlertClosed);
    }, []);

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
            const scrollPosition = window.scrollY + headerHeight + 200;
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
            const offset = headerHeight;
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
                top: headerHeight,
                width: 240,
                height: 'calc(100vh + 65px)', // Plus margin-bottom of 75px offset
                overflowY: 'auto',
                backgroundColor: '#003D6D',
                borderRight: `1px solid ${theme.palette.divider}`,
                scrollbarWidth: 'thin',
                scrollbarColor: '#9fd7ed #003D6D',
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#003D6D',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#9fd7ed',
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
                                color: 'white',
                                '&.Mui-selected': {
                                    backgroundColor: '#9fd7ed',
                                    color: '#002849',
                                    '&:hover': {
                                        backgroundColor: '#9fd7ed',
                                        color: '#002849 !important',
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: '#9fd7ed',
                                    color: '#002849 !important',
                                },
                            }}
                        >
                            <ListItemText
                                primary={section.title}
                                primaryTypographyProps={{
                                    sx: {
                                        fontSize: '0.9rem',
                                        color: 'inherit',
                                        fontWeight: '100',
                                    },
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
                                                color: 'white',
                                                '&.Mui-selected': {
                                                    backgroundColor: '#9fd7ed',
                                                    color: '#002849',
                                                    '&:hover': {
                                                        backgroundColor: '#9fd7ed',
                                                    },
                                                },
                                                '&:hover': {
                                                    color: '#002849 !important',
                                                    backgroundColor: '#9fd7ed',
                                                },
                                            }}
                                        >
                                            <ListItemText
                                                primary={childSection.title.replace('#', '')}
                                                primaryTypographyProps={{
                                                    sx: {
                                                        fontSize: '0.85rem',
                                                        color: 'inherit',
                                                        fontWeight: '100',
                                                    },
                                                }}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                        {index < sections.length - 1 && (
                            <Divider aria-hidden="true" sx={{ backgroundColor: 'white' }} />
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
};
