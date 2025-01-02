"use client"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

type Props = {
    linkGroups: {
        group_name: string;
        links: {
            text: string;
            URL: string;
            target: string;
        }[];
    }[];
};

export const Navbar = ({linkGroups}: Props) => {

    type AnchorElNavState = { anchor: HTMLElement, groupIndex: number } | null;
    const [anchorElNav, setAnchorElNav] = React.useState<AnchorElNavState>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>, groupIndex: number) => {
        setAnchorElNav({ anchor: event.currentTarget, groupIndex });
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };


    return (
        <AppBar position="static" color="default">
            <Container>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Company Name
                    </Typography>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {linkGroups.map((group, index) => (
                            <Box key={index} sx={{ display: 'flex' }}>
                                <Tooltip title={group.group_name}>
                                    <Button color="inherit" onClick={(event) => handleOpenNavMenu(event, index)}>{group.group_name}</Button>
                                </Tooltip>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav?.anchor}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                >
                                    {anchorElNav && linkGroups[anchorElNav.groupIndex].links.map((link, index) => (
                                        <MenuItem key={index} onClick={() => window.open(link.URL, link.target)}>
                                            {link.text}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
