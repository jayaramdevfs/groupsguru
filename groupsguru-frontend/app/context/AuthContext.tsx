"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/lib/api";
import { isUserRole, UserRole } from "@/lib/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  loading: boolean;
  login: () => Promise<UserRole | null>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<UserRole | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const applyUnauthenticatedState = useCallback(() => {
    setIsAuthenticated(false);
    setRole(null);
  }, []);

  const refreshAuth = useCallback(async (): Promise<UserRole | null> => {
    try {
      const response = await api.get("/api/auth/me");
      const serverRole = response?.data?.data?.role;

      if (isUserRole(serverRole)) {
        // We set these here, but initializeAuth will also ensure loading is handled
        setIsAuthenticated(true);
        setRole(serverRole);
        return serverRole;
      }

      applyUnauthenticatedState();
      return null;
    } catch {
      applyUnauthenticatedState();
      return null;
    }
  }, [applyUnauthenticatedState]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      // First call to check cookie status
      const resolvedRole = await refreshAuth();

      if (!mounted) return;

      // Note: refreshAuth already calls applyUnauthenticatedState or sets role
      // But we call it again to be absolutely sure we have a stable render
      if (resolvedRole === null) {
        applyUnauthenticatedState();
      }

      setLoading(false);
    };

    void initializeAuth();

    return () => {
      mounted = false;
    };
  }, [refreshAuth, applyUnauthenticatedState]);

  const login = async (): Promise<UserRole | null> => {
    // Only set loading if really needed, but keep it true for the redirect
    setLoading(true);

    try {
      const resolvedRole = await refreshAuth();

      if (isUserRole(resolvedRole)) {
        return resolvedRole;
      }

      applyUnauthenticatedState();
      return null;
    } finally {
      if (typeof window !== "undefined") {
        // We delay setting loading to false slightly to allow router.push 
        // in LoginForm to win before ProtectedLayout on the current page sees loading: false
        setTimeout(() => setLoading(false), 50);
      } else {
        setLoading(false);
      }
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      applyUnauthenticatedState();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, loading, login, logout, refreshAuth }}
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
