import React, { createContext, useContext } from "react";
import development from '../AppSettings.development.json';
import production from '../AppSettings.production.json';

const environment = process.env.REACT_APP_ENVIRONMENT;
let appConfig = environment === "production" ? production : development;

const ConfigContext = createContext()

export const ConfigProvider = ({children, cookies}) => 
    <ConfigContext.Provider value={{ appConfig, cookies }} >
        {children}
    </ConfigContext.Provider>

export const useConfig = () => useContext(ConfigContext);