"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import Image from "next/image";

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
            company_name: string;
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
    const [anchorElNav, setAnchorElNav] = React.useState<AnchorElNavState>(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [expandedGroups, setExpandedGroups] = React.useState<Set<number>>(new Set());
    const [mounted, setMounted] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
        if (target === "_blank") {
            window.open(url, target);
        } else {
            window.location.href = url;
        }
    };

    const logoURL = `${process.env.NEXT_PUBLIC_CMS_API_URL}${navbar.logo.image.formats.thumbnail.url}`;

    return (
        <AppBar position="static" color="default">
            <Toolbar>
                <Box
                    component={Link}
                    href="/"
                    display="flex"
                    alignItems="center"
                    sx={{
                        marginRight: "auto",
                        textDecoration: 'none',
                        color: 'inherit'
                    }}
                >
                    <Box sx={{ position: 'relative', width: '100px', height: '100px', marginRight: '16px' }}>
                        <Image
                            src={logoURL}
                            alt="logo"
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>
                    <Typography variant="h6" component="div">
                        {navbar.logo.company_name}
                    </Typography>
                </Box>

                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                    {navbar.navbar_link_groups.map((group, index) => (
                        <Box key={index} sx={{ display: "flex" }}>
                            <Tooltip title={group.group_name}>
                                <Button
                                    color="inherit"
                                    onClick={(event) => handleOpenNavMenu(event, index)}
                                >
                                    {group.group_name}
                                </Button>
                            </Tooltip>
                            <Menu
                                id={`menu-appbar-${index}`}
                                anchorEl={anchorElNav?.groupIndex === index ? anchorElNav.anchor : null}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                }}
                                open={anchorElNav?.groupIndex === index}
                                onClose={handleCloseNavMenu}
                            >
                                {group.links.map((link, linkIndex) => (
                                    <MenuItem
                                        key={linkIndex}
                                        onClick={() => handleNavigation(link.URL, link.target)}
                                    >
                                        {link.text}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    ))}
                </Box>

                <IconButton
                    sx={{ display: { md: "none" } }}
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleDrawerToggle}
                >
                    <MenuIcon />
                </IconButton>

                <Drawer
                    anchor="right"
                    open={drawerOpen}
                    onClose={handleDrawerToggle}
                    sx={{ display: { xs: "block", md: "none" } }}
                >
                    <Box sx={{ width: 250 }}>
                        <List>
                            {navbar.navbar_link_groups.map((group, index) => (
                                <React.Fragment key={index}>
                                    <ListItem button onClick={() => toggleGroup(index)}>
                                        <ListItemText
                                            primary={group.group_name}
                                            primaryTypographyProps={{
                                                variant: "h6",
                                                fontWeight: "bold",
                                            }}
                                        />
                                        {expandedGroups.has(index) ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse
                                        in={expandedGroups.has(index)}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <List component="div" disablePadding>
                                            {group.links.map((link, linkIndex) => (
                                                <ListItem
                                                    button
                                                    key={linkIndex}
                                                    onClick={() => handleNavigation(link.URL, link.target)}
                                                    sx={{ pl: 4 }}
                                                >
                                                    <ListItemText primary={link.text} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </Box>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};
