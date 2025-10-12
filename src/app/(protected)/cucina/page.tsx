"use client";

import { ComandaCard } from "@/components/ComandaCard";
import { DepartmentLayout } from "@/components/DepartmentLayout";
import { useAuth } from "@/hooks/useAuth";
import { useComande } from "@/hooks/useComande";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

function CucinaContent() {
  const { role } = useAuth();
  const { data: comande, isLoading, error } = useComande();

  const filteredComande = useMemo(() => {
    if (!comande) return { cucina: [] };

    // Comande che hanno almeno un piatto per cucina
    const cucina = comande.filter((c) =>
      c.dettagli_comanda.some((d) => d.reparto === "cucina")
    );

    return { cucina };
  }, [comande]);

  const getTabContent = () => {
    const comandesToShow = filteredComande.cucina;

    if (comandesToShow.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Nessuna comanda trovata
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Non ci sono comande per la cucina
          </Typography>
        </Paper>
      );
    }

    return (
      <Box>
        {comandesToShow.map((comanda) => (
          <ComandaCard
            key={comanda.id}
            comanda={comanda}
            currentUserRole={role || "cuoca"}
          />
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
    <>
      <Paper sx={{ mb: 3, p: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6">👩‍🍳 Comande Cucina</Typography>
          <Chip
            label={filteredComande.cucina.length}
            size="small"
            color="primary"
          />
        </Box>
      </Paper>

      {getTabContent()}
    </>
  );
}

export default function CucinaPage() {
  return (
    <DepartmentLayout
      department="cuoca"
      title="Cucina"
      icon="👩‍🍳"
      description="Coordinamento della cucina"
    >
      <CucinaContent />
    </DepartmentLayout>
  );
}
