"use client";

import { ComandaCard } from "@/components/ComandaCard";
import { RepartoPageLayout } from "@/components/RepartoPageLayout";
import { useAuth } from "@/hooks/useAuth";
import { useComande } from "@/hooks/useComande";
import { Alert, Box, CircularProgress, Paper, Typography } from "@mui/material";
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
    <RepartoPageLayout
      title="Cucina"
      icon="👩‍🍳"
      description="Coordinamento della cucina"
      department="cuoca"
      comandeCount={filteredComande.cucina.length}
      comandeLabel="👩‍🍳 Comande Cucina"
    >
      {getTabContent()}
    </RepartoPageLayout>
  );
}

export default function CucinaPage() {
  return <CucinaContent />;
}
