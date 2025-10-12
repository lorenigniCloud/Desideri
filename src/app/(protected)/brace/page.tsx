"use client";

import { ComandaCard } from "@/components/ComandaCard";
import { RepartoPageLayout } from "@/components/RepartoPageLayout";
import { useAuth } from "@/hooks/useAuth";
import { useComande } from "@/hooks/useComande";
import { Alert, Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useMemo } from "react";

function BraceContent() {
  const { role } = useAuth();
  const { data: comande, isLoading, error } = useComande();

  const filteredComande = useMemo(() => {
    if (!comande) return { brace: [] };

    const brace = comande.filter((c) =>
      c.dettagli_comanda.some((d) => d.reparto === "brace")
    );

    return { brace };
  }, [comande]);

  const getTabContent = () => {
    const comandesToShow = filteredComande.brace;

    if (comandesToShow.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Nessuna comanda trovata
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Non ci sono comande per la brace
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
            currentUserRole={role || "bracerista"}
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
      title="Brace"
      icon="🍖"
      description="Preparazione carni e grigliate"
      department="bracerista"
      comandeCount={filteredComande.brace.length}
      comandeLabel="🍖 Comande Brace"
    >
      {getTabContent()}
    </RepartoPageLayout>
  );
}

export default function BracePage() {
  return <BraceContent />;
}
