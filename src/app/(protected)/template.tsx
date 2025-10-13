"use client";

import { PermissionWrapper } from "@/components/PermissionWrapper";
import { useAuth } from "@/hooks/useAuth";
import { usePermissionsStore } from "@/stores/permissionsStore";
import { UserRole } from "@/types/auth";
import { Box, CircularProgress, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

interface ProtectedTemplateProps {
  children: React.ReactNode;
}

// Mapping delle route ai ruoli richiesti
const ROUTE_PERMISSIONS: Record<string, UserRole> = {
  "/brace": "bracerista",
  "/cassa": "cassiere",
  "/cucina": "cuoca",
};

export default function ProtectedTemplate({
  children,
}: ProtectedTemplateProps) {
  console.log("ProtectedTemplate");
  const { isAuthenticated, isHydrated, role } = useAuth();
  const { setUserRole } = usePermissionsStore();
  const pathname = usePathname();

  // Sincronizza il ruolo utente con il store dei permessi
  useEffect(() => {
    setUserRole(role);
  }, [role, setUserRole]);

  // Determina il ruolo richiesto per la route corrente
  const requiredRole = ROUTE_PERMISSIONS[pathname];

  // Mostra loading durante l'idratazione
  if (!isHydrated) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Caricamento...
        </Typography>
      </Box>
    );
  }

  // Se non autenticato, reindirizza (gestito dal DepartmentLayout)
  if (!isAuthenticated) {
    return null;
  }

  // Se non c'è un ruolo richiesto specifico, mostra il contenuto
  if (!requiredRole) {
    return <>{children}</>;
  }

  if (!role) {
    return null;
  }

  // Wrapper con controllo permessi per visualizzazione
  // Tutti possono vedere, ma solo il ruolo specifico può modificare
  return (
    <PermissionWrapper
      currentUserRole={role}
      requiredRole={requiredRole}
      requireEdit={false} // Tutti possono visualizzare
      fallback={
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
          gap={2}
        >
          <Typography variant="h4" color="error">
            Accesso Negato
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Non hai i permessi per visualizzare questa sezione.
            <br />
            Contatta l&apos;amministratore per ottenere l&apos;accesso.
          </Typography>
        </Box>
      }
    >
      {children}
    </PermissionWrapper>
  );
}
