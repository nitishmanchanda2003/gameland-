// src/context/AuthContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const AuthContext = createContext();

// ⭐ Custom Hook
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // -----------------------------
  //  INITIAL LOAD FROM LOCALSTORAGE
  // -----------------------------
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || null;
    } catch {
      return null;
    }
  });

  // -----------------------------
  //  SET AXIOS AUTH HEADER WHEN TOKEN CHANGES
  // -----------------------------
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // -----------------------------
  //  LOGIN (Save to state + localStorage)
  // -----------------------------
  const login = (userData, newToken) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", newToken);
    } catch {}

    setUser(userData);
    setToken(newToken);
  };

  // -----------------------------
  //  LOGOUT
  // -----------------------------
  const logout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch {}

    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
