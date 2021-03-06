import { createContext, useContext, useEffect, useState } from "react";
import { useConfig } from "../Config/ConfigContext";
import { useNavigate } from "react-router-dom";

const LoginContext = createContext(null);

export const LoginProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState();
    const navigate = useNavigate();

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
        setUser({});
        setIsAuthenticated(false);
        document.cookie = "token=";
        navigate("/login");
        window.location.reload();
    };

    useEffect(() => {
        let cancel = false;
        if ((isAuthenticated && Object.keys(user).length !== 0 ) || !cookies.token || cancel)  return;

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
                setUser({});
                setIsAuthenticated(false);
                document.cookie = "token=";
                navigate("/login")
            }
        }

        load();
        return () => {
            cancel= true;
        }
    }, [API, cookies.token, isAuthenticated, navigate, user])
     
    return (
        <LoginContext.Provider value={{ login, signUp, logout, user, isAuthenticated }}>
            {children}
        </LoginContext.Provider>
    )
};

export const useLogin = () => useContext(LoginContext)