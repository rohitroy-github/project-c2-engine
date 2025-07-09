// src/context/MyContext.js
import { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    const updateAuth = (newValue) => {
        setUserInfo(newValue);
    };

    return (
        <AuthContext.Provider value={{ userInfo, updateAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy access
export const useAuthContext = () => useContext(AuthContext);
