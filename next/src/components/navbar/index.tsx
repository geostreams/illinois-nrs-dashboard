'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import Image from 'next/image';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { ListItemButton, Paper, Popper, Fade, ClickAwayListener } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

type Props = {
    navbar: {
        logo: {
            image: {
                formats: {
                    thumbnail: {
                        url: string;
                    };
                };
            };
        };
        navbar_link_groups: {
            group_name: string;
            links: {
                text: string;
                URL: string;
                target: string;
            }[];
        }[];
    };
};

// Custom Menubar Components inspired by shadcn but using Material-UI styling
type MenubarContextType = {
    activeMenu: string | null;
    setActiveMenu: (menuId: string | null) => void;
    isAnyMenuOpen: boolean;
    focusedIndex: number;
    setFocusedIndex: (index: number) => void;
    menuItems: Array<{ onClick: () => void; text: string }>;
    setMenuItems: (items: Array<{ onClick: () => void; text: string }>) => void;
};

const MenubarContext = React.createContext<MenubarContextType>({
    activeMenu: null,
    setActiveMenu: () => {},
    isAnyMenuOpen: false,
    focusedIndex: -1,
    setFocusedIndex: () => {},
    menuItems: [],
    setMenuItems: () => {},
});

const Menubar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
    const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
    const [menuItems, setMenuItems] = React.useState<Array<{ onClick: () => void; text: string }>>([]);
    const isAnyMenuOpen = activeMenu !== null;
    const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        // Clear any pending close timeout when entering the menubar
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    };

    const handleMouseLeave = () => {
        // Set a timeout to close the menu when leaving the entire menubar area
        closeTimeoutRef.current = setTimeout(() => {
            setActiveMenu(null);
            setFocusedIndex(-1);
        }, 100); // Small delay to allow moving between trigger and content
    };

    const handleClickAway = () => {
        setActiveMenu(null);
        setFocusedIndex(-1);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!isAnyMenuOpen) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setFocusedIndex((prev) => (prev + 1) % menuItems.length);
                break;
            case 'ArrowUp':
                event.preventDefault();
                setFocusedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < menuItems.length) {
                    menuItems[focusedIndex].onClick();
                }
                break;
            case 'Escape':
                event.preventDefault();
                setActiveMenu(null);
                setFocusedIndex(-1);
                break;
        }
    };

    React.useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    React.useEffect(() => {
        // Reset focused index when menu changes
        if (activeMenu !== null) {
            setFocusedIndex(0);
        }
    }, [activeMenu]);

    return (
        <MenubarContext.Provider
            value={{
                activeMenu,
                setActiveMenu,
                isAnyMenuOpen,
                focusedIndex,
                setFocusedIndex,
                menuItems,
                setMenuItems,
            }}
        >
            <ClickAwayListener onClickAway={handleClickAway}>
                <Box
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        width: '100%',
                        height: '100%',
                        alignItems: 'stretch',
                        margin: 0,
                        padding: 0,
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    {children}
                </Box>
            </ClickAwayListener>
        </MenubarContext.Provider>
    );
};

const MenubarMenu: React.FC<{ children: React.ReactNode; menuId: string }> = ({ children, menuId }) => {
    const { activeMenu, setActiveMenu } = React.useContext(MenubarContext);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const isOpen = activeMenu === menuId;

    const handleTriggerClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        if (isOpen) {
            setActiveMenu(null);
        } else {
            setActiveMenu(menuId);
        }
    };

    const handleTriggerMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        // Always open menu on hover
        setActiveMenu(menuId);
    };

    const handleClose = React.useCallback(() => {
        setActiveMenu(null);
    }, [setActiveMenu]);

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                height: '100%',
            }}
            onMouseEnter={handleTriggerMouseEnter}
        >
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    if (child.type === MenubarTrigger) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return React.cloneElement(child as React.ReactElement<any>, {
                            onClick: handleTriggerClick,
                            'aria-expanded': isOpen,
                            isActive: isOpen,
                        });
                    }
                    if (child.type === MenubarContent) {
                        return (
                            <Popper
                                open={isOpen}
                                anchorEl={anchorEl}
                                placement="bottom-start"
                                transition
                                sx={{ zIndex: 1300, marginTop: '1px' }}
                                modifiers={[
                                    {
                                        name: 'offset',
                                        options: {
                                            offset: [0, 0],
                                        },
                                    },
                                ]}
                            >
                                {({ TransitionProps }) => (
                                    <Fade {...TransitionProps} timeout={150}>
                                        <Paper
                                            sx={{
                                                backgroundColor: '#002849',
                                                color: 'white',
                                                borderRadius: 0,
                                                minWidth: '200px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
                                            {React.cloneElement(child as React.ReactElement<any>, {
                                                onItemClick: handleClose,
                                            })}
                                        </Paper>
                                    </Fade>
                                )}
                            </Popper>
                        );
                    }
                }
                return child;
            })}
        </Box>
    );
};

const MenubarTrigger: React.FC<{
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    'aria-expanded'?: boolean;
    isActive?: boolean;
}> = ({ children, onClick, 'aria-expanded': ariaExpanded, isActive }) => (
    <Button
        color="inherit"
        onClick={onClick}
        aria-expanded={ariaExpanded}
        sx={{
            color: 'inherit',
            height: '100%',
            fontSize: '1.0em',
            paddingLeft: '15px',
            paddingRight: '15px',
            borderRadius: 0,
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
        }}
    >
        {children}
    </Button>
);

const MenubarContent: React.FC<{
    children: React.ReactNode;
    onItemClick?: () => void;
}> = ({ children, onItemClick }) => {
    const { setMenuItems, focusedIndex, setFocusedIndex } = React.useContext(MenubarContext);

    const stableOnItemClick = React.useCallback(() => {
        onItemClick?.();
    }, [onItemClick]);

    React.useEffect(() => {
        const items: Array<{ onClick: () => void; text: string }> = [];
        React.Children.forEach(children, (child) => {
            if (React.isValidElement(child) && child.type === MenubarItem) {
                const childProps = child.props as { onClick?: () => void; children: React.ReactNode };
                items.push({
                    onClick: () => {
                        if (childProps.onClick) {
                            childProps.onClick();
                        }
                        stableOnItemClick();
                    },
                    text: typeof childProps.children === 'string' ? childProps.children : '',
                });
            }
        });
        setMenuItems(items);
    }, [children, stableOnItemClick, setMenuItems]);

    return (
        <Box role="menu" aria-orientation="vertical" sx={{ py: 1 }}>
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child) && child.type === MenubarItem) {
                    const childProps = child.props as { onClick?: () => void };
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return React.cloneElement(child as React.ReactElement<any>, {
                        onClick: () => {
                            if (childProps.onClick) {
                                childProps.onClick();
                            }
                            onItemClick?.();
                        },
                        onMouseEnter: () => setFocusedIndex(index),
                        isFocused: focusedIndex === index,
                        index,
                    });
                }
                return child;
            })}
        </Box>
    );
};

const MenubarItem: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    onMouseEnter?: () => void;
    isFocused?: boolean;
    index?: number;
}> = ({ children, onClick, onMouseEnter, isFocused = false }) => {
    const itemRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        if (isFocused && itemRef.current) {
            itemRef.current.scrollIntoView({ block: 'nearest' });
        }
    }, [isFocused]);

    return (
        <Box
            ref={itemRef}
            component="button"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            role="menuitem"
            tabIndex={-1}
            sx={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 16px',
                backgroundColor: isFocused ? '#1A1A1A' : 'transparent',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '14px',
                outline: isFocused ? '2px solid #6FB9E4' : 'none',
                outlineOffset: '-2px',
                '&:hover': {
                    backgroundColor: '#1A1A1A',
                },
            }}
        >
            {children}
        </Box>
    );
};

export const Navbar: React.FC<Props> = ({ navbar }) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [expandedGroups, setExpandedGroups] = React.useState<Set<number>>(new Set());
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const toggleGroup = (groupIndex: number) => {
        setExpandedGroups((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(groupIndex)) {
                newSet.delete(groupIndex);
            } else {
                newSet.add(groupIndex);
            }
            return newSet;
        });
    };

    const handleNavigation = (url: string, target: string) => {
        if (!mounted) return;
        if (target === '_blank') {
            window.open(url, target);
        } else {
            window.location.href = url;
        }
    };

    const logoURL = `${process.env.CMS_API_URL}${navbar.logo.image.formats.thumbnail.url}`;

    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                height: { xs: '90px', md: '110px' },
                '@media print': {
                    position: 'static',
                    height: 'auto',
                    marginBottom: '20px',
                    // Hide the second toolbar (navigation menu) when printing
                    '& > .MuiAppBar-root > :nth-of-type(2)': {
                        display: 'none',
                    },
                },
            }}
        >
            <AppBar position="static" color="default">
                {/* Top Section with Logo */}
                <Toolbar
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        justifyContent: 'flex-start',
                        background: 'linear-gradient(to right, #0C4377 , #4395bc)',
                        '@media print': {
                            borderBottom: 'none',
                            // Ensure logo and text are visible in print
                            background: 'none !important',
                            '& .MuiTypography-root': {
                                color: '#000 !important',
                            },
                        },
                    }}
                >
                    <Box
                        component={Link}
                        href="/"
                        display="flex"
                        alignItems="center"
                        sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            padding: '0.25em',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                width: { xs: '40px', sm: '65px' },
                                height: { xs: '40px', sm: '65px' },
                                marginRight: '16px',
                            }}
                        >
                            <Image
                                src={logoURL}
                                alt="Illinois Nutrient Loss Reduction Strategy logo"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontFamily: 'Montserrat, sans-serif',
                                fontWeight: 'bold',
                                fontSize: { xs: '1.0em', sm: '1.5em' },
                                color: '#ffffff',
                            }}
                        >
                            Illinois Nutrient Loss Reduction Strategy{' '}
                            <span style={{ color: '#6FB9E4' }}>Data Portal</span>
                        </Typography>
                    </Box>

                    {/* Search Bar */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Box component="label" sx={visuallyHidden} htmlFor="desktop-search">
                            Search the website
                        </Box>
                        <TextField
                            id="desktop-search"
                            variant="outlined"
                            placeholder="SEARCH..."
                            size="small"
                            aria-label="Search form"
                            sx={{
                                backgroundColor: 'transparent',
                                borderRadius: '20px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '20px',
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'white' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Toolbar>

                {/* Bottom Section with Navigation */}
                <Toolbar
                    disableGutters
                    sx={{
                        justifyContent: 'flex-start',
                        minHeight: '32px !important',
                        backgroundColor: '#002849',
                        color: 'primary.contrastText',
                        padding: 0,
                    }}
                >
                    <Menubar>
                        {/* Homepage Link */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                height: '100%',
                                paddingLeft: '15px',
                                paddingRight: '15px',
                            }}
                        >
                            <Button
                                color="inherit"
                                onClick={() => handleNavigation('/', '_self')}
                                sx={{
                                    color: 'inherit',
                                    height: '100%',
                                    fontSize: '1.0em',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                Home
                            </Button>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white' }} />

                        {/* Navigation Link Groups using custom Menubar */}
                        {navbar.navbar_link_groups.map((group, index) => (
                            <React.Fragment key={index}>
                                <MenubarMenu menuId={`menu-${index}`}>
                                    <MenubarTrigger>{group.group_name}</MenubarTrigger>
                                    <MenubarContent>
                                        {group.links.map((link, linkIndex) => (
                                            <MenubarItem
                                                key={linkIndex}
                                                onClick={() => handleNavigation(link.URL, link.target)}
                                            >
                                                {link.text}
                                            </MenubarItem>
                                        ))}
                                    </MenubarContent>
                                </MenubarMenu>
                                {index < navbar.navbar_link_groups.length - 1 && (
                                    <Divider
                                        aria-hidden="true"
                                        orientation="vertical"
                                        flexItem
                                        sx={{ bgcolor: 'white' }}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </Menubar>

                    <IconButton
                        sx={{
                            display: { md: 'none' },
                            position: 'absolute',
                            right: 16,
                            color: 'inherit',
                        }}
                        size="large"
                        edge="start"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Mobile Navigation Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        backgroundColor: '#002849',
                        color: 'primary.contrastText',
                    },
                }}
            >
                <Box
                    sx={{
                        width: 250,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    <List>
                        {navbar.navbar_link_groups.map((group, index) => (
                            <React.Fragment key={index}>
                                <ListItemButton
                                    onClick={() => toggleGroup(index)}
                                    sx={{ color: 'primary.contrastText' }}
                                >
                                    <ListItemText
                                        primary={group.group_name}
                                        primaryTypographyProps={{
                                            variant: 'h6',
                                            fontWeight: 'bold',
                                            sx: {
                                                color: 'primary.contrastText',
                                            },
                                        }}
                                    />
                                    {expandedGroups.has(index) ? (
                                        <ExpandLess
                                            sx={{
                                                color: 'primary.contrastText',
                                            }}
                                        />
                                    ) : (
                                        <ExpandMore
                                            sx={{
                                                color: 'primary.contrastText',
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                                <Collapse in={expandedGroups.has(index)} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {group.links.map((link, linkIndex) => (
                                            <ListItemButton
                                                key={linkIndex}
                                                onClick={() => handleNavigation(link.URL, link.target)}
                                                sx={{
                                                    pl: 4,
                                                    color: 'primary.contrastText',
                                                }}
                                            >
                                                <ListItemText primary={link.text} />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>
                                <Divider sx={{ bgcolor: 'white' }} />
                            </React.Fragment>
                        ))}
                    </List>

                    {/* Search Bar at the Bottom of the Drawer */}
                    <Box sx={{ p: 2, mt: 'auto' }}>
                        <Box component="label" sx={visuallyHidden} htmlFor="mobile-search">
                            Search the website
                        </Box>
                        <TextField
                            id="mobile-search"
                            variant="outlined"
                            placeholder="SEARCH..."
                            size="small"
                            aria-label="Search form"
                            sx={{
                                backgroundColor: 'white', // Set background to white
                                borderRadius: '20px', // Make the background rounded
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '20px', // Match the border radius
                                    '& fieldset': {
                                        borderColor: 'white', // Set border color to white
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white', // Keep border color white on hover
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: 'black', // Set font color to black for visibility
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'black' }} />{' '}
                                        {/* Set icon color to black for visibility */}
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
};
