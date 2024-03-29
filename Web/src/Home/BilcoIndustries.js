import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LoginProvider } from '../Login/LoginContext';
import HeaderBar from '../Header/HeaderBar.js';
import { ThemeProvider, createTheme, CssBaseline, useMediaQuery } from '@mui/material';
import { StrictMode, useState } from 'react';
import { ConfigProvider } from '../Config/ConfigContext';
import { BrowserRouter } from 'react-router-dom';
import SlotMachine from '../Games/Casino/Pages/SlotMachine';
import Blackjack from "../Games/Casino/Pages/Blackjack";
import Sweepstake from "../Sweepstake/Sweepstake";
import RoadtripPlanner from "../RoadtripPlanner/RoadtripPlanner";
import Login from "../Login/Login";
import SignUp from "../Login/SignUp";
import {
    Routes,
    Route,
} from "react-router-dom";
import Home from './Home';
import Gecho from '../Gecho/Gecho';
import MineSweeper from '../Games/Minesweeper/MineSweeper';
import Ceremony from '../Wedding/Ceremony';
import AfterParty from '../Wedding/AfterParty';

const primary = "#282c34";
const secondaryMain = "#5fcc00";
const secondaryAlt = "#f50057";

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
                main: primary
            },
            secondary: {
                main: secondaryMain,
                alt: secondaryAlt
            }
        },
        typography: {
            gradient: {
                fontSize: "inherit",
                background: "-webkit-linear-gradient(45deg, " + secondaryAlt + " 30%, " + secondaryMain + " 70%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
            },
        },
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
                                        <Route path="games/mine-sweeper" element={<MineSweeper />} />
                                        <Route path="sweepstake" element={<Sweepstake />} />
                                        <Route path="roadtrip" element={<RoadtripPlanner />} />
                                        <Route path="signup" element={<SignUp />} />
                                        <Route path="login" element={<Login />} />
                                        <Route path="gecho" element={<Gecho />} />
                                        <Route path="wedding/ceremony" element={<Ceremony />} />
                                        <Route path="wedding/after-party" element={<AfterParty />} />
                                        <Route path="*" element={<Home />} />
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