"use client";

import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

interface CassaPageLayoutProps {
  children: React.ReactNode;
  title: string;
  icon: string;
  description: string;
  department: string;
}

export const CassaPageLayout: React.FC<CassaPageLayoutProps> = ({
  children,
  title,
  icon,
  description,
  department,
}) => {
  const { role } = useAuth();
  const router = useRouter();

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

        {/* Header con ruolo */}
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

        {/* Contenuto della pagina */}
        {children}
      </div>
    </div>
  );
};
