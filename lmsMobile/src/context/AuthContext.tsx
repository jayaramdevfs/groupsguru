import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { api, setAuthToken, getAuthToken } from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  role: "ADMIN" | "STUDENT";
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const TOKEN_KEY = "lms_auth_token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto session restore on app start
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (!savedToken) {
          setLoading(false);
          return;
        }

        setAuthToken(savedToken);
        const response = await api.get("/api/auth/me");
        const backendUser = response.data.data;

        setUser({
          role: backendUser.role === "ADMIN" ? "ADMIN" : "STUDENT",
          email: backendUser.email,
        });
      } catch (error) {
        // Token expired or invalid — clear it
        setAuthToken(null);
        await AsyncStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const loginResponse = await api.post("/api/auth/login", { email, password });

    // Backend now returns token in response body for mobile clients
    const token = loginResponse.data.data;
    setAuthToken(token);
    await AsyncStorage.setItem(TOKEN_KEY, token);

    const response = await api.get("/api/auth/me");
    const backendUser = response.data.data;

    setUser({
      role: backendUser.role === "ADMIN" ? "ADMIN" : "STUDENT",
      email: backendUser.email,
    });
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setAuthToken(null);
      await AsyncStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
