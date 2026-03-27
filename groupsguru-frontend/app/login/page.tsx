"use client";

import { useEffect } from "react";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { LanguageToggle } from "../../components/ui/LanguageToggle";
import { Logo } from "../../components/ui/Logo";
import { CinematicLogo } from "../../components/ui/CinematicLogo";

export default function LoginPage() {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !isAuthenticated) return;
    if (role === "ADMIN") router.replace("/admin/dashboard");
    if (role === "STUDENT") router.replace("/student/dashboard");
  }, [isAuthenticated, role, loading, router]);

  if (loading || isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#191919] flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 max-w-[900px] w-full mx-auto">
        <Logo size="sm" />
        <LanguageToggle />
      </header>

      {/* Centered Login Card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[400px]">
          {/* Logo + Title */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="mb-4">
              <CinematicLogo width={100} height={100} />
            </div>
            <h1
              className="text-[28px] text-[#E8E8E8] mb-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Welcome back
            </h1>
            <p className="text-[13px] text-[#666666] font-medium">
              Sign in to your GroupsGuru account
            </p>
          </div>

          {/* Form Card */}
          <div className="p-6 rounded-[12px] border border-[#3A3A3A] bg-[#1E1E1E]">
            <LoginForm />
          </div>

          <p className="text-center mt-6 text-[11px] text-[#666666] font-medium">
            GroupsGuru Exam Intelligence Engine
          </p>
        </div>
      </div>
    </div>
  );
}
