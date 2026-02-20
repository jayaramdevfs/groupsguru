"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/context/AuthContext";

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

  return <>{children}</>;
}