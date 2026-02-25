'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
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
import { usePathname } from 'next/navigation';
import Image from 'next/image';
// import SearchIcon from '@mui/icons-material/Search';
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
import { ListItemButton, Paper, Popper, Fade, ClickAwayListener } from '@mui/material';
import { MaintenanceAlert } from '@/components/MaintenanceAlert';
// import { visuallyHidden } from '@mui/utils';
import { Syncopate } from 'next/font/google';
import { montserrat } from '@/theme';

const syncopate = Syncopate({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const normalizePathname = (pathname: string) => {
    if (!pathname) return '/';
    const sanitized = pathname.split('?')[0].split('#')[0];
    if (sanitized !== '/' && sanitized.endsWith('/')) {
        return sanitized.slice(0, -1);
    }
    return sanitized;
};

const getPathSegments = (pathname: string) => normalizePathname(pathname).split('/').filter(Boolean);

const getLastSegment = (pathname: string) => {
    const segments = getPathSegments(pathname);
    return segments.length ? segments[segments.length - 1] : null;
};

const resolveLinkPathname = (url: string) => {
    try {
        return normalizePathname(new URL(url, 'http://localhost').pathname);
    } catch {
        return normalizePathname(url);
    }
};

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
            navbarGroupSlug: string;
            links: {
                text: string;
                URL: string;
                target: string;
            }[];
        }[];
        SiteNotice?: {
            AlertTitle: string;
            AlertText: string;
        };
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
                    component="nav"
                    aria-label="Main navigation"
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
                            menuId,
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
                                                menuId,
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
    isCurrent?: boolean;
    menuId?: string;
}> = ({ children, onClick, 'aria-expanded': ariaExpanded, isActive, isCurrent, menuId }) => (
    <Button
        color="inherit"
        onClick={onClick}
        aria-expanded={ariaExpanded}
        aria-haspopup="menu"
        aria-controls={menuId ? `${menuId}-menu` : undefined}
        id={menuId ? `${menuId}-trigger` : undefined}
        sx={{
            color: isCurrent && !isActive ? '#002849' : 'inherit',
            height: '100%',
            fontSize: '1.0em',
            fontWeight: 'bold',
            paddingLeft: '15px',
            paddingRight: '15px',
            borderRadius: 0,
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : isCurrent ? '#9fd7ed' : 'transparent',
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
    menuId?: string;
}> = ({ children, onItemClick, menuId }) => {
    const { setMenuItems, focusedIndex, setFocusedIndex } = React.useContext(MenubarContext);

    const stableOnItemClick = React.useCallback(() => {
        onItemClick?.();
    }, [onItemClick]);

    React.useEffect(() => {
        const items: Array<{ onClick: () => void; text: string }> = [];
        const itemChildren = React.Children.toArray(children).filter(
            (child) => React.isValidElement(child) && child.type === MenubarItem
        ) as React.ReactElement[];

        itemChildren.forEach((child, index) => {
            const childProps = child.props as { children: React.ReactNode };
            items.push({
                onClick: () => {
                    stableOnItemClick();
                    if (!menuId) return;
                    const selector = `[data-menu-id="${menuId}"][data-menu-index="${index}"]`;
                    const element = document.querySelector(selector) as HTMLElement | null;
                    element?.click();
                },
                text: typeof childProps.children === 'string' ? childProps.children : '',
            });
        });
        setMenuItems(items);
    }, [children, menuId, stableOnItemClick, setMenuItems]);

    return (
        <Box
            role="menu"
            aria-orientation="vertical"
            id={menuId ? `${menuId}-menu` : undefined}
            aria-labelledby={menuId ? `${menuId}-trigger` : undefined}
            sx={{ py: 1 }}
        >
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
                        menuId,
                    });
                }
                return child;
            })}
        </Box>
    );
};

const MenubarItem: React.FC<{
    children: React.ReactNode;
    href?: string;
    target?: string;
    onClick?: () => void;
    onMouseEnter?: () => void;
    isFocused?: boolean;
    isActive?: boolean;
    index?: number;
    menuId?: string;
}> = ({ children, href, target, onClick, onMouseEnter, isFocused = false, isActive = false, index, menuId }) => {
    const itemRef = React.useRef<HTMLAnchorElement | HTMLButtonElement>(null);

    React.useEffect(() => {
        if (isFocused && itemRef.current) {
            itemRef.current.focus();
            itemRef.current.scrollIntoView({ block: 'nearest' });
        }
    }, [isFocused]);

    return (
        <Box
            ref={itemRef}
            component={href ? Link : 'button'}
            href={href}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            role="menuitem"
            tabIndex={-1}
            aria-current={isActive ? 'page' : undefined}
            data-menu-id={menuId}
            data-menu-index={index}
            sx={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 16px',
                backgroundColor: isFocused ? '#1A1A1A' : isActive ? '#9fd7ed' : 'transparent',
                border: 'none',
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                outline: isFocused ? '2px solid #9fd7ed' : isActive ? '2px solid #6FB9E4' : 'none',
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
    const pathname = usePathname();
    const normalizedPathname = normalizePathname(pathname);
    const lastPathnameRef = React.useRef(normalizedPathname);
    const pathSegments = getPathSegments(normalizedPathname);
    const isDashboardPage = pathSegments[1] === 'dashboard';
    const activeLinkLastSegment = isDashboardPage ? getLastSegment(normalizedPathname) : null;
    const activeLinkPathname = !isDashboardPage ? normalizedPathname : null;

    // Derive active group by finding which group owns links whose first path segment
    // matches the current page's first path segment. This works without relying on
    // navbarGroupSlug being populated in the CMS.
    const currentFirstSegment = pathSegments[0] ?? null;
    const activeGroupIndex =
        currentFirstSegment !== null
            ? navbar.navbar_link_groups.findIndex((group) =>
                  group.links.some((link) => {
                      const linkSegments = getPathSegments(resolveLinkPathname(link.URL));
                      return linkSegments[0] === currentFirstSegment;
                  })
              )
            : -1;

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

    React.useEffect(() => {
        if (activeGroupIndex < 0) return;
        setExpandedGroups((prev) => {
            if (prev.has(activeGroupIndex)) return prev;
            const next = new Set(prev);
            next.add(activeGroupIndex);
            return next;
        });
    }, [activeGroupIndex]);

    React.useEffect(() => {
        if (normalizedPathname === lastPathnameRef.current) return;
        lastPathnameRef.current = normalizedPathname;
        if (drawerOpen) {
            setDrawerOpen(false);
        }
    }, [normalizedPathname, drawerOpen]);

    React.useEffect(() => {
        if (drawerOpen) return;
        if (activeGroupIndex >= 0) {
            setExpandedGroups(new Set([activeGroupIndex]));
        } else {
            setExpandedGroups(new Set());
        }
    }, [drawerOpen, activeGroupIndex]);

    const logoURL = `${process.env.CMS_API_URL}${navbar.logo.image.formats.thumbnail.url}`;

    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                height: 'auto',
                minHeight: { xs: '90px', md: '110px' },
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
            <AppBar position="static" color="default" elevation={0} sx={{ boxShadow: 'none' }}>
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
                        <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                                component="span"
                                className={syncopate.className}
                                sx={{
                                    fontWeight: 700,
                                    color: '#81cdef',
                                    fontSize: { xs: '18px', sm: '22px', md: 'clamp(22px, 3vw, 26px)' },
                                    marginTop: '4px',
                                    marginLeft: '10px',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Illinois
                            </Box>
                            {/* Desktop view - single line */}
                            <Box
                                component="span"
                                sx={{
                                    display: { xs: 'none', md: 'inline' },
                                    fontFamily: montserrat.style.fontFamily,
                                    fontWeight: 700,
                                    color: '#dedede',
                                    fontSize: 'clamp(12px, 2.5vw, 24px)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginLeft: '8px',
                                }}
                            >
                                Nutrient Loss Reduction Strategy
                                <Box component="span" sx={{ color: '#ffffff', whiteSpace: 'nowrap' }}>
                                    &nbsp;Data Portal
                                </Box>
                            </Box>
                            {/* Mobile/Tablet view - two lines */}
                            <Box
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                    flexDirection: 'column',
                                    marginLeft: '8px',
                                    lineHeight: 1.2,
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        fontFamily: montserrat.style.fontFamily,
                                        fontWeight: 700,
                                        color: '#dedede',
                                        fontSize: { xs: '10px', sm: '14px' },
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    Nutrient Loss Reduction
                                </Box>
                                <Box
                                    component="span"
                                    sx={{
                                        fontFamily: montserrat.style.fontFamily,
                                        fontWeight: 700,
                                        color: '#dedede',
                                        fontSize: { xs: '10px', sm: '14px' },
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    Strategy
                                    <Box component="span" sx={{ color: '#ffffff' }}>
                                        {' '}
                                        Data Portal
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* Search Bar */}
                    {/* <Box
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
                    </Box> */}
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
                        <Button
                            component={Link}
                            href="/"
                            color="inherit"
                            sx={{
                                color: 'inherit',
                                height: '100%',
                                fontSize: '1.0em',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                paddingLeft: '15px',
                                paddingRight: '15px',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            Home
                        </Button>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white' }} />

                        {/* Navigation Link Groups using custom Menubar */}
                        {navbar.navbar_link_groups.map((group, index) => {
                            const isActiveGroup = index === activeGroupIndex;
                            return (
                                <React.Fragment key={index}>
                                    <MenubarMenu menuId={`menu-${index}`}>
                                        <MenubarTrigger isCurrent={isActiveGroup}>{group.group_name}</MenubarTrigger>
                                        <MenubarContent>
                                            {group.links.map((link, linkIndex) => {
                                                const linkPathname = resolveLinkPathname(link.URL);
                                                const isActiveLink = activeLinkPathname
                                                    ? linkPathname === activeLinkPathname
                                                    : activeLinkLastSegment
                                                      ? getLastSegment(linkPathname) === activeLinkLastSegment
                                                      : false;
                                                return (
                                                    <MenubarItem
                                                        key={linkIndex}
                                                        href={link.URL}
                                                        target={link.target}
                                                        isActive={isActiveGroup && isActiveLink}
                                                    >
                                                        {link.text}
                                                    </MenubarItem>
                                                );
                                            })}
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
                            );
                        })}
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

            {/* Maintenance Alert - only shown if alertTitle and alertText are provided */}
            {navbar.SiteNotice?.AlertTitle && navbar.SiteNotice?.AlertText && (
                <MaintenanceAlert title={navbar.SiteNotice.AlertTitle} text={navbar.SiteNotice.AlertText} />
            )}

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
                        {navbar.navbar_link_groups.map((group, index) => {
                            const isActiveGroup = index === activeGroupIndex;
                            return (
                                <React.Fragment key={index}>
                                    <ListItemButton
                                        onClick={() => toggleGroup(index)}
                                        sx={{
                                            color: 'primary.contrastText',
                                            backgroundColor: isActiveGroup ? '#9fd7ed' : 'transparent',
                                        }}
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
                                            {group.links.map((link, linkIndex) => {
                                                const linkPathname = resolveLinkPathname(link.URL);
                                                const isActiveLink = activeLinkPathname
                                                    ? linkPathname === activeLinkPathname
                                                    : activeLinkLastSegment
                                                      ? getLastSegment(linkPathname) === activeLinkLastSegment
                                                      : false;
                                                return (
                                                    <ListItemButton
                                                        key={linkIndex}
                                                        component={Link}
                                                        href={link.URL}
                                                        target={link.target}
                                                        rel={
                                                            link.target === '_blank' ? 'noopener noreferrer' : undefined
                                                        }
                                                        aria-current={
                                                            isActiveGroup && isActiveLink ? 'page' : undefined
                                                        }
                                                        sx={{
                                                            pl: 4,
                                                            color: 'primary.contrastText',
                                                            backgroundColor:
                                                                isActiveGroup && isActiveLink
                                                                    ? '#4AA6DC'
                                                                    : 'transparent',
                                                            borderTop:
                                                                isActiveGroup && isActiveLink
                                                                    ? '1px solid #ffffff'
                                                                    : '1px solid transparent',
                                                            borderBottom:
                                                                isActiveGroup && isActiveLink
                                                                    ? '1px solid #ffffff'
                                                                    : '1px solid transparent',
                                                        }}
                                                    >
                                                        <ListItemText primary={link.text} />
                                                    </ListItemButton>
                                                );
                                            })}
                                        </List>
                                    </Collapse>
                                    <Divider sx={{ bgcolor: 'white' }} />
                                </React.Fragment>
                            );
                        })}
                    </List>

                    {/* Search Bar at the Bottom of the Drawer */}
                    {/* <Box sx={{ p: 2, mt: 'auto' }}>
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
                    {/* </InputAdornment> */}
                    {/* ),
                            }} */}
                    {/* /> */}
                    {/*</Box> */}
                </Box>
            </Drawer>
        </Box>
    );
};
