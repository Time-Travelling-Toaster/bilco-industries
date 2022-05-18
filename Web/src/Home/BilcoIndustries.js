import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LoginProvider } from '../Login/LoginContext';
import HeaderBar from '../Header/HeaderBar.js';
import { ThemeProvider, createTheme, CssBaseline, useMediaQuery } from '@mui/material';
import { StrictMode, useState } from 'react';
import { ConfigProvider } from '../Config/ConfigContext';
import { BrowserRouter } from 'react-router-dom';
import SlotMachine from '../Casino/Games/Pages/SlotMachine';
import Blackjack from "../Casino/Games/Pages/Blackjack";
import Sweepstake from "../Sweepstake/Sweepstake";
import RoadtripPlanner from "../RoadtripPlanner/RoadtripPlanner";
import Login from "../Login/Login";
import SignUp from "../Login/SignUp";
import {
    Routes,
    Route,
} from "react-router-dom";
import Home from './Home';

const BilcoIndustries = () => {
    const cookies = document.cookie.split(";").reduce((reducer, cookie) => {
        const [key, value] = cookie.split("=");
        return {
            ...reducer,
            [key.trim(" ")]: value
        }
    }, {});

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
            <BrowserRouter>
                <LocalizationProvider dateAdapter={AdapterMoment} >
                    <ConfigProvider cookies={cookies}>
                        <ThemeProvider theme={theme}>
                            <CssBaseline>
                                <LoginProvider>
                                    <HeaderBar isLightTheme={isLightTheme} setIsLightTheme={setIsLightTheme} />
                                    <Routes>
                                        <Route path="casino/slot-machine" element={<SlotMachine />} />
                                        <Route path="casino/black-jack" element={<Blackjack />} />
                                        <Route path="sweepstake" element={<Sweepstake />} />
                                        <Route path="roadtrip" element={<RoadtripPlanner />} />
                                        <Route path="signup" element={<SignUp />} />
                                        <Route path="login" element={<Login />} />
                                        <Route path="/" element={<Home />} />
                                    </Routes>
                                </LoginProvider>
                            </CssBaseline>
                        </ThemeProvider>
                    </ConfigProvider>
                </LocalizationProvider>
            </BrowserRouter>
        </StrictMode>
    )
}

export default BilcoIndustries;