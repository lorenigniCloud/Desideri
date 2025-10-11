"use client";

import { initializeAuthFromCookies, useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export const useAuth = () => {
  const { isAuthenticated, role, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) {
      initializeAuthFromCookies();
    }
  }, [isHydrated]);

  return {
    isAuthenticated,
    role,
    isHydrated,
  };
};
