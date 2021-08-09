import React, { useState, createContext, useContext } from "react";

export const StoreContext = createContext();
export const StoreProvider = props => {
    const [user, setUser] = useState();
    return <StoreContext.Provider value={[user, setUser]} {...props} ></StoreContext.Provider>;
};

export const useContextStore = () => useContext(StoreContext);
