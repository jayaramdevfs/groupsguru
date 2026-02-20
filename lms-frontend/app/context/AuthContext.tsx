"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getToken,
  setToken,
  removeToken,
  decodeToken,
  isTokenExpired,
} from "@/lib/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  role: "ADMIN" | "STUDENT" | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<"ADMIN" | "STUDENT" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token || isTokenExpired()) {
      removeToken();
      setIsAuthenticated(false);
      setRole(null);
      setLoading(false);
      return;
    }

    const payload = decodeToken();
    if (payload?.role === "ADMIN" || payload?.role === "STUDENT") {
      setIsAuthenticated(true);
      setRole(payload.role);
    }

    setLoading(false);
  }, []);

  const login = (token: string) => {
    setToken(token);
    const payload = decodeToken();

    if (payload?.role === "ADMIN" || payload?.role === "STUDENT") {
      setIsAuthenticated(true);
      setRole(payload.role);
    }
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};