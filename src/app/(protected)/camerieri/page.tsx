"use client";

import { ComandaCard } from "@/components/ComandaCard";
import { RepartoPageLayout } from "@/components/RepartoPageLayout";
import { useComande } from "@/hooks/useComande";
import { separaComandeComplete } from "@/lib/comanda-status-utils";
import { CAMERIERI } from "@/lib/supabase";
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

function CamerieriContent() {
  const [tabValue, setTabValue] = useState(0);
  const { data: comande, isLoading, error } = useComande();
  const [selectedCameriere, setSelectedCameriere] = useState<string>("");

  // Filtra le comande per cameriere selezionato
  const filteredComande = useMemo(() => {
    if (!comande) return [];

    if (!selectedCameriere) return comande;

    return comande.filter(
      (comanda) => comanda.nome_cameriere === selectedCameriere
    );
  }, [comande, selectedCameriere]);

  // Separa le comande filtrate in attive e concluse
  const { attive: comandeAttive, concluse: comandeConcluse } = useMemo(() => {
    return separaComandeComplete(filteredComande);
  }, [filteredComande]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getTabContent = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          Errore nel caricamento delle comande
        </Alert>
      );
    }

    const comandesToShow = tabValue === 0 ? comandeAttive : comandeConcluse;
    const tipoOrdini = tabValue === 0 ? "attivi" : "conclusi";

    if (comandesToShow.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            {selectedCameriere
              ? `Nessun ordine ${tipoOrdini} per ${selectedCameriere}`
              : `Nessun ordine ${tipoOrdini}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedCameriere
              ? `Non ci sono ordini ${tipoOrdini} per questo cameriere`
              : `Non ci sono ordini ${tipoOrdini} nel sistema`}
          </Typography>
        </Paper>
      );
    }

    return (
      <>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          {tabValue === 0
            ? `📋 Ordini Attivi (${comandeAttive.length})`
            : `✅ Ordini Conclusi (${comandeConcluse.length})`}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {comandesToShow.map((comanda) => (
            <ComandaCard key={comanda.id} comanda={comanda} />
          ))}
        </Box>
      </>
    );
  };

  return (
    <RepartoPageLayout
      title="Camerieri"
      icon="🍽️"
      description="Visualizzazione comande per cameriere"
      department="cameriere"
      comandeCount={filteredComande.length}
      comandeLabel="🍽️ Comande Camerieri"
    >
      {/* Filtro per cameriere */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔍 Filtro Comande
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Cameriere</InputLabel>
          <Select
            value={selectedCameriere}
            onChange={(e) => setSelectedCameriere(e.target.value)}
            label="Cameriere"
          >
            <MenuItem value="">
              <em>Tutti i camerieri</em>
            </MenuItem>
            {CAMERIERI.map((cameriere) => (
              <MenuItem key={cameriere} value={cameriere}>
                {cameriere}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedCameriere && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Visualizzando comande per: <strong>{selectedCameriere}</strong>
          </Typography>
        )}
      </Paper>

      {/* Tabs per ordini attivi/conclusi */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label={`📋 Ordini Attivi (${comandeAttive.length})`} />
          <Tab label={`✅ Ordini Conclusi (${comandeConcluse.length})`} />
        </Tabs>
      </Paper>

      {getTabContent()}
    </RepartoPageLayout>
  );
}

export default function CamerieriPage() {
  return <CamerieriContent />;
}
