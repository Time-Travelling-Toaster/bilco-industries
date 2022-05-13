import { createContext, useContext, useState } from "react";

const RouterContext = createContext(null);

export const RouterProvider = ({ defaultPage, children }) => {
    const url = new URL(window.location.href);
    const [page, setPage] = useState(url.searchParams.get("page") || defaultPage);
    
    const updatePage = (path) => {
        url.searchParams.set('page', path);
        window.history.pushState(null, '', url);
        setPage(path);
    }

    return (
        <RouterContext.Provider value={{ page, setPage: updatePage, queryParams: url.query }}>
            {children}
        </RouterContext.Provider>
    )
};

export const useRouter = () => useContext(RouterContext)