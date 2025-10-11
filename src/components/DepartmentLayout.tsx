"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePermissionsStore } from "@/stores/permissionsStore";
import { UserRole } from "@/types/auth";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Navbar } from "./Navbar";

interface DepartmentLayoutProps {
  children: React.ReactNode;
  department: UserRole;
  title: string;
  icon: string;
  description: string;
}

export const DepartmentLayout: React.FC<DepartmentLayoutProps> = ({
  children,
  department,
  title,
  icon,
  description,
}) => {
  const { isAuthenticated, isHydrated, role } = useAuth();
  const { setUserRole, canView } = usePermissionsStore();
  const router = useRouter();

  // Sincronizza il ruolo utente con il store dei permessi
  useEffect(() => {
    setUserRole(role);
  }, [role, setUserRole]);

  // Gestisce il redirect se non autenticato
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isHydrated, router]);

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

  // Se non autenticato, non mostrare nulla (il redirect è gestito nell'useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // Verifica i permessi di visualizzazione
  if (!canView(department)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
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
          <Typography variant="body1" color="text.secondary">
            Non hai i permessi per visualizzare questa sezione.
          </Typography>
        </Box>
      </div>
    );
  }

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pulsante Indietro */}
        <Box mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{ mb: 2 }}
          >
            Torna ai Reparti
          </Button>
        </Box>

        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            {icon} {title}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {description}
          </Typography>
          {role !== department && (
            <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
              ⚠️ Stai visualizzando in modalità sola lettura
            </Typography>
          )}
        </Box>
        {children}
      </div>
    </div>
  );
};
