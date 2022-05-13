import { Button, Menu} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useLogin } from "../Login/LoginContext";
import { useNavigate } from "react-router-dom";
import { useConfig } from "../Config/ConfigContext";

const NavMenu = () => {
    const { user } = useLogin();
    const navigate = useNavigate();
    const { appConfig: { pages }} = useConfig()
    const [casinoMenuElement, setCasinoMenuElement] = useState(null);
    const NavButton = ({title, path, logged}) => logged && !user ? null : <Button color="secondary" key={title} onClick={() => navigate(path)}>{title}</Button>

    return (
        <Box sx={{ display: 'flex' }}>
            {pages.map(({ title, children, path, logged }) => {
                if (logged && !user) return null;
                if (children) 
                    return (
                        <Box key={title} sx={{ display: { xs: 'none', md: 'flex' }}}>
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
    )
}

export default NavMenu;