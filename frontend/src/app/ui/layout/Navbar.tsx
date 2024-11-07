"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    label: string;
    href: string;
}

const navigationItems: NavItem[] = [
    { label: "Point Source", href: "/point-source" },
    { label: "Water Quality", href: "/water-quality" },
    { label: "Contact", href: "/contact" },
];

interface NavbarProps {
    className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
    const pathname = usePathname();
    const [anchorElNav, setAnchorElNav] = React.useState<HTMLElement | null>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" color="default" className={className}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                    {/* Logo and Title Section */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Link href="/" passHref>
                            <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                                <Image
                                    src="/logo.png"
                                    alt="Illinois NRS Logo"
                                    width={50}
                                    height={50}
                                    priority
                                    quality={90}
                                />
                            </Box>
                        </Link>
                        <Link href="/" passHref style={{ textDecoration: "none" }}>
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    display: { xs: "none", md: "flex" },
                                    fontWeight: 700,
                                    color: "inherit",
                                }}
                            >
                                Illinois Nutrient Loss Reduction Strategy
                            </Typography>
                        </Link>
                    </Box>

                    {/* Mobile Title */}
                    <Link href="/" passHref style={{ textDecoration: "none" }}>
                        <Typography
                            variant="h5"
                            noWrap
                            sx={{
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                            }}
                        >
                            Illinois NRS
                        </Typography>
                    </Link>

                    {/* Mobile Menu */}
                    <Box sx={{ display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="navigation menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            keepMounted
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {navigationItems.map(({ label, href }) => (
                                <Link key={href} href={href} passHref style={{ textDecoration: "none" }}>
                                    <MenuItem
                                        onClick={handleCloseNavMenu}
                                        selected={pathname === href}
                                    >
                                        <Typography textAlign="center" color="inherit">
                                            {label}
                                        </Typography>
                                    </MenuItem>
                                </Link>
                            ))}
                        </Menu>
                    </Box>

                    {/* Desktop Menu */}
                    <Box sx={{ display: { xs: "none", md: "flex", gap: 2 } }}>
                        {navigationItems.map(({ label, href }) => (
                            <Link key={href} href={href} passHref style={{ textDecoration: "none" }}>
                                <Button
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        my: 2,
                                        color: "inherit",
                                        display: "block",
                                        backgroundColor: pathname === href ? "rgba(0, 0, 0, 0.04)" : "transparent",
                                    }}
                                >
                                    {label}
                                </Button>
                            </Link>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
