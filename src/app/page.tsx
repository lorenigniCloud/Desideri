"use client";

import { DepartmentSelector } from "@/components/DepartmentSelector";
import { Navbar } from "@/components/Navbar";
import { RoleSelector } from "@/components/RoleSelector";
import { useAuth } from "@/hooks/useAuth";
import { usePermissionsStore } from "@/stores/permissionsStore";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isHydrated, role } = useAuth();
  const { setUserRole } = usePermissionsStore();

  // Sincronizza il ruolo utente con il store dei permessi
  useEffect(() => {
    setUserRole(role);
  }, [role, setUserRole]);

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

  // Se l'utente non è autenticato, mostra il selettore di ruoli
  if (!isAuthenticated) {
    return <RoleSelector />;
  }

  // Se l'utente è autenticato, mostra il selettore di reparti
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <DepartmentSelector />
    </div>
  );
}
