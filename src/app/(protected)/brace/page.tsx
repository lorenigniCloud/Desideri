"use client";

import { ComandaCard } from "@/components/ComandaCard";
import { RepartoPageLayout } from "@/components/RepartoPageLayout";
import { TotalePiattiDaServire } from "@/components/TotalePiattiDaServire";
import { WaiterFilter } from "@/components/WaiterFilter";
import { useComande } from "@/hooks/useComande";
import { filtraESeparaComandePerReparto } from "@/lib/comanda-status-utils";
import { ComandaCompleta } from "@/lib/supabase";
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

function BraceContent() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedCameriere, setSelectedCameriere] = useState("");
  const { data: comande, isLoading, error } = useComande();

  // Filtra le comande per cameriere se selezionato
  const comandeFiltrate = useMemo(() => {
    if (!comande) return [];
    if (!selectedCameriere) return comande;
    return comande.filter(
      (comanda) => comanda.nome_cameriere === selectedCameriere
    );
  }, [comande, selectedCameriere]);

  // Filtra e separa le comande per reparto brace
  const { attive: comandeAttive, concluse: comandeConcluse } = useMemo(() => {
    if (!comandeFiltrate) return { attive: [], concluse: [] };
    return filtraESeparaComandePerReparto(comandeFiltrate, "brace");
  }, [comandeFiltrate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getTabContent = (
    comande: ComandaCompleta[],
    tipo: "attive" | "concluse"
  ) => {
    if (comande.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            {tipo === "attive"
              ? "Nessun ordine attivo"
              : "Nessun ordine concluso"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {tipo === "attive"
              ? "Non ci sono ordini attivi per la brace"
              : "Non ci sono ordini completati per la brace"}
          </Typography>
        </Paper>
      );
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {comande.map((comanda) => (
          <ComandaCard key={comanda.id} comanda={comanda} />
        ))}
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Errore nel caricamento delle comande</Alert>;
  }

  return (
    <RepartoPageLayout
      title="Brace"
      icon="🍖"
      description="Preparazione carni e grigliate"
      department="bracerista"
      comandeCount={comandeAttive.length + comandeConcluse.length}
      comandeLabel="🍖 Comande Brace"
    >
      <WaiterFilter
        selectedCameriere={selectedCameriere}
        onCameriereChange={setSelectedCameriere}
      />

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label={`📋 Ordini Attivi (${comandeAttive.length})`} />
          <Tab label={`✅ Ordini Conclusi (${comandeConcluse.length})`} />
        </Tabs>
      </Paper>

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

      {!isLoading && !error && (
        <>
          {tabValue === 0 && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                📋 Ordini Attivi ({comandeAttive.length})
              </Typography>

              {/* Accordion con totali piatti da servire */}
              <TotalePiattiDaServire comande={comandeAttive} reparto="brace" />

              {getTabContent(comandeAttive, "attive")}
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                ✅ Ordini Conclusi ({comandeConcluse.length})
              </Typography>
              {getTabContent(comandeConcluse, "concluse")}
            </Box>
          )}
        </>
      )}
    </RepartoPageLayout>
  );
}

export default function BracePage() {
  return <BraceContent />;
}
