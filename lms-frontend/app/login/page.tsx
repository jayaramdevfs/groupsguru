"use client";

import { useEffect } from "react";
import LoginForm from "../../components/auth/LoginForm";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { LanguageToggle } from "../../components/ui/LanguageToggle";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

export default function LoginPage() {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !isAuthenticated) {
      return;
    }

    if (role === "ADMIN") {
      router.replace("/admin/dashboard");
      return;
    }

    if (role === "STUDENT") {
      router.replace("/student/dashboard");
    }
  }, [isAuthenticated, role, loading, router]);

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0a0114] -z-20" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 blur-[150px] rounded-full -z-10" />

      {/* Top Bar */}
      <header className="absolute top-0 left-0 w-full p-8 flex items-center justify-between z-50 max-w-7xl mx-auto left-1/2 -translate-x-1/2">
        <div className="text-xl font-black tracking-tighter">
          Groups<span className="text-purple-500">Guru</span>
        </div>
        <LanguageToggle />
      </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={spring}
        className="relative z-10 w-full max-w-xl p-12 rounded-[48px]
                   backdrop-blur-[100px]
                   border border-white/10
                   bg-white/[0.03]
                   shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-3 tracking-tight">
            Welcome to the <span className="text-purple-400">Command Center</span>
          </h2>
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em]">
            Authentication Required
          </p>
        </div>

        <LoginForm />
        
        <div className="mt-10 text-center">
          <p className="text-white/20 text-[10px] font-medium tracking-widest uppercase">
            GroupsGuru Exam Intelligence Engine v5.0
          </p>
        </div>
      </motion.div>
    </div>
  );
}


