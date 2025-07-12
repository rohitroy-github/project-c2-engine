// src/context/MyContext.js
import { createContext, useContext, useState } from "react";
import { fetchStatus } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  // ✅ Updates the user information in the context (used when user logs in/registers)
  const updateAuth = (newValue) => {
    setUserInfo(newValue);
  };

  /**
   * 🔁 Refresh the latest user financial info (USD, PnL)
   * This fetches fresh data from the backend for the current user
   * Called after trades to reflect updated balance and profit/loss affected balance
   */
  const refreshUserInfo = async (username) => {
    try {
      const res = await fetchStatus(username);
      setUserInfo((prev) => ({
        ...prev,
        usd: res.data.usd,
        pnl: res.data.pnl,
        realizedPNL: res.data.realizedPNL,
        unrealizedPNL: res.data.unrealizedPNL,
        holdings: res.data.holdings,
      }));
    } catch (err) {
      console.error("🔴 Failed to refresh user info:", err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ userInfo, updateAuth, refreshUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
