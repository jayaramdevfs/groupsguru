"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserRole } from "./auth";

interface GuardOptions {
  requiredRole?: "ADMIN" | "STUDENT";
}

export const useRouteGuard = (options?: GuardOptions) => {
  const router = useRouter();

  useEffect(() => {
    const authenticated = isAuthenticated();

    if (!authenticated) {
      router.replace("/login");
      return;
    }

    if (options?.requiredRole) {
      const role = getUserRole();

      if (role !== options.requiredRole) {
        router.replace("/login");
      }
    }
  }, [router, options?.requiredRole]);
};