"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import AnimatedInput from "../ui/AnimatedInput";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration protocol failed.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      {error && (
        <div className="p-4 bg-[#C74444]/10 border border-[#C74444]/30 rounded flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C74444]"></div>
          <span className="text-[10px] font-mono font-bold text-[#C74444] uppercase tracking-widest">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <AnimatedInput
          label="Full Name"
          placeholder="e.g. Jayram Prasad"
          value={name}
          onChange={(v) => setName(v.toString())}
          required
        />

        <AnimatedInput
          label="Email Address"
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(v) => setEmail(v.toString())}
          required
        />

        <AnimatedInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(v) => setPassword(v.toString())}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 rounded bg-[#D97706] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#F59E0B] transition-colors shadow-lg shadow-[#D97706]/20"
      >
        Create Account
      </button>

      <div className="text-center pt-6">
        <Link href="/login" className="text-sm font-medium text-[#666666] hover:text-[#D97706] transition-colors">
          Already have an account? <span className="font-bold underline decoration-[#D97706]/30">Sign in</span>
        </Link>
      </div>
    </form>
  );
}