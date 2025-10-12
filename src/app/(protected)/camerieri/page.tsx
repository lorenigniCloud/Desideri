"use client";

import { ComandaCard } from "@/components/ComandaCard";
import { RepartoPageLayout } from "@/components/RepartoPageLayout";
import { useComande } from "@/hooks/useComande";
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
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

function CamerieriContent() {
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

    if (filteredComande.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            {selectedCameriere
              ? `Nessuna comanda per ${selectedCameriere}`
              : "Seleziona un cameriere"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedCameriere
              ? "Non ci sono comande per questo cameriere"
              : "Scegli un cameriere dal menu a tendina per visualizzare le sue comande"}
          </Typography>
        </Paper>
      );
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {filteredComande.map((comanda) => (
          <ComandaCard key={comanda.id} comanda={comanda} />
        ))}
      </Box>
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

      {getTabContent()}
    </RepartoPageLayout>
  );
}

export default function CamerieriPage() {
  return <CamerieriContent />;
}
