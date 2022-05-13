import { createContext, useContext, useEffect, useState } from "react";
import { useConfig } from "../Config/ConfigContext";
import { useNavigate } from "react-router-dom";

const LoginContext = createContext(null);

export const LoginProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState();
    const navigator = useNavigate();

    const { appConfig : { connectionStrings: { API } }, cookies } = useConfig();   

    const login = async (username, password, remember) => {
        const response = await fetch(API + "/login", { 
            method: "POST", 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({username, password, remember}) 
        });

        if (response.status === 200) {
            const { userId, token, expiryDate } = await response.json();
            if (remember) document.cookie = `token=${token}; expires=${expiryDate}`
            
            setUser({ username, userId })
            setIsAuthenticated(true);
        }

        return response;
    }

    const signUp = async (username, password) => {
        const response = await fetch(API + "/signup", { 
            method: "POST", 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({username, password}) 
        });
        
        if (response.status === 201) {
            const { userId } = await response.json();
            setUser({ username, userId })
            setIsAuthenticated(true);
        }

        return response;
    }

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        document.cookie = "token=";
        navigator.push("/login")
    };

    useEffect(() => {
        let cancel = false;
        if ((isAuthenticated && !!user) || cancel)  return;

        const load =  async() => {
            const response = await fetch(API + "/token", { 
                method: "POST", 
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ token: cookies.token }) 
            });
    
            if (response.status === 200) {
                const { userId, username } = await response.json();
                setUser({ username, userId })
                setIsAuthenticated(true);        
                
            } else {
                setUser(null);
                setIsAuthenticated(false);
                document.cookie = "token=";
                navigator.push("/login")
            }
        }

        load();
        return () => {
            cancel= true;
        }
    }, [API, cookies.token, isAuthenticated, navigator, user])
     
    return (
        <LoginContext.Provider value={{ login, signUp, logout, user, isAuthenticated }}>
            {children}
        </LoginContext.Provider>
    )
};

export const useLogin = () => useContext(LoginContext)