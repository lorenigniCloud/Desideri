"use client";

import { UserRole } from "@/types/auth";
import React from "react";

interface PermissionWrapperProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  currentUserRole: UserRole;
  fallback?: React.ReactNode;
  requireEdit?: boolean; // Se true, richiede permessi di modifica, altrimenti solo visualizzazione
}

export const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  children,
  requiredRole,
  currentUserRole,
  fallback = null,
  requireEdit = false,
}) => {
  // Logica per controllare se l'utente può modificare il reparto specifico
  const hasPermission = () => {
    if (!requireEdit) return true; // Tutti possono visualizzare

    // Solo il ruolo corrispondente può modificare il proprio reparto
    return currentUserRole === requiredRole;
  };

  if (!hasPermission()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
