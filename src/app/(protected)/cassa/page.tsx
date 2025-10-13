"use client";

import { CassaPageLayout } from "@/components/CassaPageLayout";
import { ComandaCard } from "@/components/ComandaCard";
import { CreateComandaForm } from "@/components/CreateComandaForm";
import { PermissionWrapper } from "@/components/PermissionWrapper";
import { useAuth } from "@/hooks/useAuth";
import { useComande } from "@/hooks/useComande";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";

function CassaContent() {
  const [tabValue, setTabValue] = useState(0);
  const { data: comande, isLoading, error } = useComande();
  const { role } = useAuth();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <CassaPageLayout
      title="Cassa"
      icon="💰"
      description="Gestione ordini e pagamenti"
      department="cassiere"
    >
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="📝 Nuova Comanda" />
          <Tab label="📋 Ordini Attivi" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <PermissionWrapper
          currentUserRole={role || "cassiere"}
          requiredRole="cassiere"
          requireEdit={true}
          fallback={
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="error">
                ⚠️ Solo i cassieri possono creare nuove comande
              </Typography>
            </Paper>
          }
        >
          <CreateComandaForm />
        </PermissionWrapper>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            📋 Ordini Attivi
          </Typography>

          {isLoading && (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Errore nel caricamento delle comande
            </Alert>
          )}

          {comande && comande.length === 0 && (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Nessuna comanda trovata
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Non ci sono comande nel sistema
              </Typography>
            </Paper>
          )}

          {comande && comande.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {comande.map((comanda) => (
                <ComandaCard
                  key={comanda.id}
                  comanda={comanda}
                  currentUserRole={role || "cassiere"}
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </CassaPageLayout>
  );
}

export default function CassaPage() {
  return <CassaContent />;
}
