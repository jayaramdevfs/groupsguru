"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import AnimatedInput from "../ui/AnimatedInput";
import { motion } from "framer-motion";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      // 🔥 IMPORTANT: token is inside response.data.data
      const token = response.data.data;

      // Store token
      localStorage.setItem("token", token);

      // Decode JWT payload
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      // Role-based redirect
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "STUDENT") {
        router.push("/student/dashboard");
      } else {
        setError("Unknown user role");
      }

    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && (
        <p className="text-[#EC4899] text-center text-[16px] font-semibold">
          {error}
        </p>
      )}

      <AnimatedInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={setEmail}
      />

      <AnimatedInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={setPassword}
      />

      <motion.button
        whileHover={{ y: -10 }}
        whileTap={{ scale: 0.95 }}
        transition={spring}
        type="submit"
        className="w-full py-4 rounded-2xl text-[18px] font-bold text-white bg-gradient-to-r from-[#9333EA] to-[#DB2777] shadow-[0px_30px_70px_rgba(147,51,234,0.6)]"
      >
        Login
      </motion.button>
    </form>
  );
}