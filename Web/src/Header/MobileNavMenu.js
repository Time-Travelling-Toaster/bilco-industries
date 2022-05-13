import { Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useLogin } from "../Login/LoginContext";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { useConfig } from "../Config/ConfigContext";

const MobileNavMenu = () => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const { isAuthenticated } = useLogin();
    const navigate = useNavigate();
    const { appConfig: { pages }} = useConfig()
    const [casinoMenuElement, setCasinoMenuElement] = useState(null);

    const MenuButton = ({title, path, logged}) => logged && !isAuthenticated ? null 
        : <MenuItem
            color="secondary"
            key={title} 
            onClick={() => {
                navigate(path);
                setDrawerIsOpen(false);
            }}
        >
            {title}
        </MenuItem>

    return (
        <Box sx={{ flexGrow: 0 }}>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => setDrawerIsOpen(!drawerIsOpen)}
                color="inherit"
            >
            <MenuIcon color="secondary" />
            </IconButton>
            <Drawer
                anchor="left"
                open={drawerIsOpen}
                onClose={() => setDrawerIsOpen(false)}
            >   
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            color="secondary"
                            sx={{ mr: 20 }}
                        >
                            Menu
                        </Typography>
                    </Toolbar>
                </Container>
                {pages.map(({ title, children, path, logged }) => {
                    if (logged && !isAuthenticated) return null;
                    if (children) 
                        return (
                            <Box key={title}>
                                <MenuItem
                                    color="secondary"
                                    onClick={({ currentTarget }) => setCasinoMenuElement(currentTarget)}
                                >
                                    {title}
                                </MenuItem>
                                <Menu
                                    anchorEl={casinoMenuElement}
                                    open={!!casinoMenuElement}
                                    onClose={() => setCasinoMenuElement(null)}
                                >
                                    {children.map(({title: childTitle, path: childPath, logged: childLogged }) => 
                                        <Box key={childTitle}>
                                            <MenuButton title={childTitle} path={childPath} logged={childLogged} />
                                            <br/>
                                        </Box>
                                    )}
                                </Menu>
                            </Box>
                        )
                    return <MenuButton key={title} title={title} path={path} logged={logged} />
                })}
            </Drawer>
        </Box>
    )
}

export default MobileNavMenu;