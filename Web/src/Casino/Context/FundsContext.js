import { createContext, useContext, useState } from "react";
const FundsContext = createContext(null);

export const FundsProvider = ({ startFunds, children }) => {
    const [funds, setFunds] = useState(startFunds);

    return (
        <FundsContext.Provider value={{ funds, setFunds }}>
            {children}
        </FundsContext.Provider>
    )
};

export const useFunds = () => useContext(FundsContext)