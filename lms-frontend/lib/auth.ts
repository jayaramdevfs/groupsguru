// lib/auth.ts

export interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

// Save token
export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

// Get token
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Remove token
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

// Decode JWT payload safely
export const decodeToken = (): JwtPayload | null => {
  try {
    const token = getToken();
    if (!token) return null;

    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    return JSON.parse(decodedPayload);
  } catch (error) {
    return null;
  }
};

// Check if token expired
export const isTokenExpired = (): boolean => {
  const payload = decodeToken();
  if (!payload) return true;

  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};

// Get user role
export const getUserRole = (): string | null => {
  const payload = decodeToken();
  return payload?.role || null;
};

// Check if authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  if (isTokenExpired()) {
    removeToken();
    return false;
  }
  return true;
};