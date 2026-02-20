import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { api } from "../api/api";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Auto session restore on app start
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.get("/api/auth/me");

        const backendUser = response.data.data;

        let normalizedRole: "ADMIN" | "STUDENT" = "STUDENT";

        if (backendUser.role === "ADMIN") {
          normalizedRole = "ADMIN";
        }

        setUser({
          role: normalizedRole,
          email: backendUser.email,
        });
      } catch (error) {
        setUser(null); // Not logged in
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    await api.post("/api/auth/login", { email, password });

    const response = await api.get("/api/auth/me");

    const backendUser = response.data.data;

    let normalizedRole: "ADMIN" | "STUDENT" = "STUDENT";

    if (backendUser.role === "ADMIN") {
      normalizedRole = "ADMIN";
    }

    setUser({
      role: normalizedRole,
      email: backendUser.email,
    });
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
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