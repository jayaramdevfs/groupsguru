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
    // Step 1: Login — get JWT token
    let loginResponse;
    try {
      loginResponse = await api.post("/api/auth/login", { email, password });
    } catch (error: any) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        throw new Error(
          "Cannot reach server. Make sure:\n" +
          "1. Backend is running on port 8080\n" +
          "2. Run: adb reverse tcp:8080 tcp:8080"
        );
      }
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error("Invalid email or password. Check credentials and try again.");
      }
      throw new Error(
        `Server error (${error.response?.status || "unknown"}): ${error.response?.data?.message || error.message}`
      );
    }

    // Step 2: Store token
    const token = loginResponse.data?.data;
    if (!token) {
      throw new Error(
        "Login succeeded but no token received. Backend may need to be updated."
      );
    }
    setAuthToken(token);
    await AsyncStorage.setItem(TOKEN_KEY, token);

    // Step 3: Fetch user profile
    try {
      const response = await api.get("/api/auth/me");
      const backendUser = response.data.data;

      setUser({
        role: backendUser.role === "ADMIN" ? "ADMIN" : "STUDENT",
        email: backendUser.email,
      });
    } catch (error: any) {
      // Token was set but /me failed — clear state
      setAuthToken(null);
      await AsyncStorage.removeItem(TOKEN_KEY);
      throw new Error(
        "Login succeeded but session failed. The JWT Bearer token may not be working. Check backend JwtAuthenticationFilter."
      );
    }
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
