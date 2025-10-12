"use client";

import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

interface RepartoPageLayoutProps {
  children: React.ReactNode;
  title: string;
  icon: string;
  description: string;
  department: string;
  comandeCount: number;
  comandeLabel: string;
}

export const RepartoPageLayout: React.FC<RepartoPageLayoutProps> = ({
  children,
  title,
  icon,
  description,
  department,
  comandeCount,
  comandeLabel,
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

        {/* Contatore comande */}
        <Paper sx={{ mb: 3, p: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">{comandeLabel}</Typography>
            <Chip label={comandeCount} size="small" color="primary" />
          </Box>
        </Paper>

        {/* Contenuto della pagina */}
        {children}
      </div>
    </div>
  );
};
