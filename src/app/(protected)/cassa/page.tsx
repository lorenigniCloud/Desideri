"use client";

import { CassaPageLayout } from "@/components/CassaPageLayout";
import { ComandaCard } from "@/components/ComandaCard";
import { CreateComandaForm } from "@/components/CreateComandaForm";
import { PermissionWrapper } from "@/components/PermissionWrapper";
import { useAuth } from "@/hooks/useAuth";
import { useComande } from "@/hooks/useComande";
import { separaComandeComplete } from "@/lib/comanda-status-utils";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

function CassaContent() {
  const [tabValue, setTabValue] = useState(0);
  const { data: comande, isLoading, error } = useComande();
  const { role } = useAuth();

  // Separa le comande in attive e concluse
  const { attive: comandeAttive, concluse: comandeConcluse } = useMemo(() => {
    if (!comande) return { attive: [], concluse: [] };
    return separaComandeComplete(comande);
  }, [comande]);

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
          <Tab label={`📋 Ordini Attivi (${comandeAttive.length})`} />
          <Tab label={`✅ Ordini Conclusi (${comandeConcluse.length})`} />
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
            📋 Ordini Attivi ({comandeAttive.length})
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

          {comandeAttive.length === 0 && !isLoading && (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Nessun ordine attivo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tutti gli ordini sono stati completati
              </Typography>
            </Paper>
          )}

          {comandeAttive.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {comandeAttive.map((comanda) => (
                <ComandaCard key={comanda.id} comanda={comanda} />
              ))}
            </Box>
          )}
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            ✅ Ordini Conclusi ({comandeConcluse.length})
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

          {comandeConcluse.length === 0 && !isLoading && (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Nessun ordine concluso
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Non ci sono ordini completati
              </Typography>
            </Paper>
          )}

          {comandeConcluse.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {comandeConcluse.map((comanda) => (
                <ComandaCard key={comanda.id} comanda={comanda} />
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
