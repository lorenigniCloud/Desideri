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

  const isCassiere = () => role === "cassiere";
  const isCuoca = () => role === "cuoca";
  const isBracerista = () => role === "bracerista";
  const isCameriere = () => role === "cameriere";
  const canSeePrices = () => isCassiere() || isCameriere();
  const canSeeCliente = () => isCassiere() || isCameriere();

  const canModifyComanda = (comandaReparto: string) => {
    if (isCassiere()) return true; // Il cassiere può modificare tutto
    if (isCuoca() && comandaReparto === "cucina") return true;
    if (isBracerista() && comandaReparto === "brace") return true;
    return false;
  };

  return {
    isAuthenticated,
    role,
    isHydrated,
    isCassiere,
    isCuoca,
    isBracerista,
    isCameriere,
    canSeePrices,
    canSeeCliente,
    canModifyComanda,
  };
};
