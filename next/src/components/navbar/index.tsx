'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import Image from 'next/image';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { ListItemButton } from '@mui/material';

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

export const Navbar: React.FC<Props> = ({ navbar }) => {
    type AnchorElNavState = { anchor: HTMLElement; groupIndex: number } | null;
    const [anchorElNav, setAnchorElNav] =
        React.useState<AnchorElNavState>(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [expandedGroups, setExpandedGroups] = React.useState<Set<number>>(
        new Set()
    );
    const [mounted, setMounted] = React.useState(false);
    const theme = useTheme();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleOpenNavMenu = (
        event: React.MouseEvent<HTMLElement>,
        groupIndex: number
    ) => {
        setAnchorElNav({ anchor: event.currentTarget, groupIndex });
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

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
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1100, height: '110px' }}>
            <AppBar position="static" color="default">
                {/* Top Section with Logo */}
                <Toolbar
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        justifyContent: 'flex-start',
                        background:
                            'linear-gradient(to right, #0C4377 , #4395bc)',
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
                                width: '65px',
                                height: '65px',
                                marginRight: '16px',
                            }}
                        >
                            <Image
                                src={logoURL}
                                alt="logo"
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
                                fontSize: '1.5em',
                                color: '#ffffff',
                            }}
                        >
                            Illinois NLRS{' '}
                            <span style={{ color: '#6FB9E4' }}>
                                Data Dashboard
                            </span>
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
                        <TextField
                            variant="outlined"
                            placeholder="SEARCH..."
                            size="small"
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
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            width: '100%',
                            height: '100%',
                            alignItems: 'stretch',
                            margin: 0,
                            padding: 0,
                        }}
                    >
                        {navbar.navbar_link_groups.map((group, index) => (
                            <React.Fragment key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '100%',
                                        paddingLeft: '0',
                                    }}
                                >
                                    <Tooltip title={group.group_name}>
                                        <Button
                                            color="inherit"
                                            onClick={(event) =>
                                                handleOpenNavMenu(event, index)
                                            }
                                            sx={{
                                                color: 'inherit',
                                                height: '100%',
                                                fontSize: '1.0em',
                                            }}
                                        >
                                            {group.group_name}
                                        </Button>
                                    </Tooltip>
                                    <Menu
                                        id={`menu-appbar-${index}`}
                                        anchorEl={
                                            anchorElNav?.groupIndex === index
                                                ? anchorElNav.anchor
                                                : null
                                        }
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                        open={anchorElNav?.groupIndex === index}
                                        onClose={handleCloseNavMenu}
                                        sx={{
                                            marginTop: '1px',
                                            '& .MuiMenu-paper': {
                                                backgroundColor: '#002849',
                                                color: 'primary.contrastText',
                                                borderRadius: '0',
                                            },
                                        }}
                                    >
                                        {group.links.map((link, linkIndex) => (
                                            <MenuItem
                                                key={linkIndex}
                                                onClick={() =>
                                                    handleNavigation(
                                                        link.URL,
                                                        link.target
                                                    )
                                                }
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#1A1A1A',
                                                    },
                                                }}
                                            >
                                                {link.text}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                                {index <
                                    navbar.navbar_link_groups.length - 1 && (
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ bgcolor: 'white' }}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </Box>

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
                                <Collapse
                                    in={expandedGroups.has(index)}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <List component="div" disablePadding>
                                        {group.links.map((link, linkIndex) => (
                                            <ListItemButton
                                                key={linkIndex}
                                                onClick={() =>
                                                    handleNavigation(
                                                        link.URL,
                                                        link.target
                                                    )
                                                }
                                                sx={{
                                                    pl: 4,
                                                    color: 'primary.contrastText',
                                                }}
                                            >
                                                <ListItemText
                                                    primary={link.text}
                                                />
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
                        <TextField
                            variant="outlined"
                            placeholder="SEARCH..."
                            size="small"
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
