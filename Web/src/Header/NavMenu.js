import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useLogin } from "../Login/LoginContext";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { useConfig } from "../Config/ConfigContext";

const NavMenu = () => {
    const { user } = useLogin();
    const navigator = useNavigate();
    const { appConfig: { pages }} = useConfig()
    const [casinoMenuElement, setCasinoMenuElement] = useState(null);
    const [burgerMenuAnchor, setBurgerMenuAnchor] = useState(null);
    const NavButton = ({title, path, logged}) => logged && !user ? null : <Button color="secondary" key={title} onClick={() => navigator.push(path)}>{title}</Button>
    const MenuButton = ({title, path, logged}) => logged && !user ? null : <MenuItem color="secondary" key={title} onClick={() => navigator.push(path)}>{title}</MenuItem>

    return (
        <>
            <Box sx={{ display: { xs: 'none', md: 'flex' }}}>
                {pages.map(({ title, children, path, logged }) => {
                    if (logged && !user) return null;
                    if (children) 
                        return (
                            <Box key={title}>
                                <Button
                                    color="secondary"
                                    onClick={({ currentTarget }) => setCasinoMenuElement(currentTarget)}
                                >
                                    {title}
                                </Button>
                                <Menu
                                    anchorEl={casinoMenuElement}
                                    open={!!casinoMenuElement}
                                    onClose={() => setCasinoMenuElement(null)}
                                >
                                    {children.map(({title: childTitle, path: childPath, logged: childLogged }) => 
                                        <Box key={childTitle}>
                                            <NavButton title={childTitle} path={childPath} logged={childLogged} />
                                            <br/>
                                        </Box>
                                    )}
                                </Menu>
                            </Box>
                        )
                    return <NavButton key={title} title={title} path={path} logged={logged} />
                })}
            </Box>
            {/* Mobile Burger menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={({ currentTarget }) => setBurgerMenuAnchor(currentTarget)}
                    color="inherit"
                >
                 <MenuIcon color="secondary" />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={burgerMenuAnchor}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(burgerMenuAnchor)}
                    onClose={() => setBurgerMenuAnchor(null)}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                    }}
                >
                    {pages.map(({ title, children, path, logged }) => {
                        if (logged && !user) return null;
                        if (children) 
                            return (
                                <Box key={title}>
                                    <MenuItem
                                        color="primary"
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
                </Menu> 
            </Box>

        </>
    )
}

export default NavMenu;