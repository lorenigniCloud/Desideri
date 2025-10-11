"use client";

import { usePermissionsStore } from "@/stores/permissionsStore";
import { UserRole } from "@/types/auth";
import React from "react";

interface PermissionWrapperProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  fallback?: React.ReactNode;
  requireEdit?: boolean; // Se true, richiede permessi di modifica, altrimenti solo visualizzazione
}

export const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  children,
  requiredRole,
  fallback = null,
  requireEdit = false,
}) => {
  const { canEdit, canView } = usePermissionsStore();

  const hasPermission = requireEdit
    ? canEdit(requiredRole)
    : canView(requiredRole);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
