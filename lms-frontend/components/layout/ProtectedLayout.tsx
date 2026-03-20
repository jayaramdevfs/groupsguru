"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/context/AuthContext";
import { LanguageToggle } from "../ui/LanguageToggle";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requiredRole: "ADMIN" | "STUDENT";
}

export default function ProtectedLayout({
  children,
  requiredRole,
}: ProtectedLayoutProps) {
  const { isAuthenticated, role, loading } = useAuth();
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


  if (loading) return null;
  if (!isAuthenticated || role !== requiredRole) return null;

  return (
    <>
      <div className="fixed top-6 right-6 z-[100]">
        <LanguageToggle />
      </div>
      {children}
    </>
  );
}
