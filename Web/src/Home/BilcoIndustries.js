import { RouterProvider } from '../Switcher/RouterContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Switch from '../Switcher/Switch';
import { LoginProvider } from '../Login/LoginContext';
import HeaderBar from '../Header/HeaderBar.js';
import { createTheme, CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { StrictMode, useState } from 'react';
import { ConfigProvider } from '../Config/ConfigContext';

const BilcoIndustries = () => {
    const cookies = document.cookie.split(";").reduce((reducer, cookie) => {
        const [key, value] = cookie.split("=");
        return {
            ...reducer,
            [key.trim(" ")]: value
        }
    }, {})
    const prefersLightTheme = useMediaQuery('(prefers-color-scheme: light)');
    const [isLightTheme, setIsLightTheme] = useState(cookies?.theme === "light" ? true : prefersLightTheme);
    
    const theme = createTheme({
        palette: {
            mode: isLightTheme ? "light" : "dark",
            primary: {
                main: '#282c34',
            },
            secondary: {
                main: '#f50057',
            },
        }
    })

    return (
        <StrictMode>
            <LocalizationProvider dateAdapter={AdapterMoment} >
                <ConfigProvider cookies={cookies}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline>
                            <RouterProvider>
                                <LoginProvider>
                                    <HeaderBar isLightTheme={isLightTheme} setIsLightTheme={setIsLightTheme} />
                                    <Switch />
                                </LoginProvider>
                            </RouterProvider>
                        </CssBaseline>
                    </ThemeProvider>
                </ConfigProvider>
            </LocalizationProvider>
        </StrictMode>
    )
}

export default BilcoIndustries;