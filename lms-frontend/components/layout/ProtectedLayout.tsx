"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/context/AuthContext";
import { LanguageToggle } from "../ui/LanguageToggle";
import Link from "next/link";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requiredRole: "ADMIN" | "STUDENT";
}

export default function ProtectedLayout({
  children,
  requiredRole,
}: ProtectedLayoutProps) {
  const { isAuthenticated, role, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (role !== requiredRole) {
      router.replace("/login");
    }
  }, [isAuthenticated, role, loading, requiredRole, router]);


  if (loading) return (
    <div className="min-h-screen bg-[#0c051a] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!isAuthenticated || role !== requiredRole) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#0c051a]/60 backdrop-blur-xl z-[100] px-6 md:px-12">
        <div className="h-full max-w-[95%] mx-auto flex items-center justify-between">
          {/* Logo / Home Link */}
          <Link 
            href={role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard"}
            className="group flex items-center gap-2"
          >
            <div className="w-10 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black italic shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
              GG
            </div>
            <span className="text-xl font-black italic tracking-tighter bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent group-hover:to-white transition-all px-1">
              GroupsGuru
            </span>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-6">
            <LanguageToggle />
            <button
              onClick={() => void logout()}
              className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all font-black italic text-xs uppercase tracking-widest text-white/60"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="pt-16">
        {children}
      </div>
    </>
  );
}
