"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../app/context/AuthContext";
import { LanguageToggle } from "../ui/LanguageToggle";
import { Sidebar } from "../ui/Sidebar";
import { Skeleton } from "../ui/Skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MenuIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

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
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("groupsguru_sidebar_collapsed");
    if (saved) setIsCollapsed(JSON.parse(saved));
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(
      "groupsguru_sidebar_collapsed",
      JSON.stringify(newState)
    );
  };

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (role && role !== requiredRole) {
      router.replace("/login");
    }
  }, [isAuthenticated, role, loading, requiredRole, router]);

  if (loading || !isMounted)
    return (
      <div className="min-h-screen bg-[#191919] flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-3xl space-y-4">
          <Skeleton variant="card" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </div>
      </div>
    );

  if (!isAuthenticated || role !== requiredRole) return null;

  // Page name from path
  const pathParts = pathname.split("/").filter((p) => p !== "");
  const pageName =
    pathParts.length > 1
      ? pathParts[pathParts.length - 1]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "Dashboard";

  return (
    <div className="min-h-screen bg-[#191919] flex">
      <Sidebar
        role={requiredRole}
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
      />

      <div
        className={`flex-1 transition-all duration-200 ease-out flex flex-col ${
          isCollapsed ? "ml-0" : "ml-0 md:ml-[260px]"
        }`}
      >
        {/* Top Navbar — 48px, flat, minimal */}
        <nav className="h-[48px] border-b border-[#3A3A3A] bg-[#191919] sticky top-0 z-40 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-1.5 text-[#666666] hover:text-[#E8E8E8] hover:bg-[#2D2D2D] rounded-[8px] transition-colors duration-150"
            >
              <MenuIcon className="w-4 h-4" />
            </button>
            <span className="text-[13px] font-medium text-[#A0A0A0]">
              {pageName}
            </span>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-1 ml-2 border-l border-[#3A3A3A] pl-4">
              <button
                onClick={() => router.back()}
                className="p-1 text-[#666666] hover:text-[#E8E8E8] hover:bg-[#2D2D2D] rounded-[6px] transition-colors"
                title="Go Back"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.forward()}
                className="p-1 text-[#666666] hover:text-[#E8E8E8] hover:bg-[#2D2D2D] rounded-[6px] transition-colors"
                title="Go Forward"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button
              onClick={() => void logout()}
              className="px-3 py-1 rounded-[8px] text-[12px] font-medium text-[#A0A0A0] hover:text-[#E8E8E8] border border-[#3A3A3A] hover:border-[#666666] transition-colors duration-150"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Content — centered, max-width 900px */}
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">
          <div className="max-w-[900px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
