"use client";

import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, role, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated) {
      if (!isAuthenticated) {
        router.push("/");
        return;
      }

      if (requiredRole && role !== requiredRole) {
        // Redirect alla pagina corretta per il ruolo dell'utente
        switch (role) {
          case "cassiere":
            router.push("/cassa");
            break;
          case "bracerista":
            router.push("/brace");
            break;
          case "cuoca":
            router.push("/cucina");
            break;
          default:
            router.push("/");
        }
      }
    }
  }, [isAuthenticated, role, requiredRole, router, isHydrated]);

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

  if (
    !isHydrated ||
    !isAuthenticated ||
    (requiredRole && role !== requiredRole)
  ) {
    return null; // Il redirect è gestito nell'useEffect
  }

  return <>{children}</>;
};
