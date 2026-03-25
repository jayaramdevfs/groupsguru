"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import AnimatedInput from "../ui/AnimatedInput";
import { useAuth } from "../../app/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/api/auth/login", {
        email,
        password,
      });

      const role = await login();

      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "STUDENT") {
        router.push("/student/dashboard");
      } else {
        setError("Unable to resolve user role");
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError("Invalid email or password");
      } else if (status === 404) {
        setError("Account not found");
      } else if (!navigator.onLine) {
        setError("No internet connection");
      } else {
        setError(
          err?.response?.data?.message || "Server error — please try again"
        );
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {error && (
        <p className="text-[#C74444] text-center text-[14px] font-medium">
          {error}
        </p>
      )}

      <AnimatedInput
        type="email"
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
      />

      <AnimatedInput
        type="password"
        label="Password"
        placeholder="Enter password"
        value={password}
        onChange={setPassword}
      />

      <button
        type="submit"
        className="w-full py-3 rounded-[8px] text-[15px] font-semibold text-white bg-[#D97706] hover:bg-[#F59E0B] transition-colors duration-150"
      >
        Sign in
      </button>
    </form>
  );
}
