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
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

function BraceContent() {
  const [activeTab, setActiveTab] = useState(0);
  const { role } = useAuth();
  const { data: comande, isLoading, error } = useComande();

  // Filtri per le comande
  const filteredComande = useMemo(() => {
    if (!comande) return { all: [], brace: [], priority: [] };

    console.log(
      "🔍 Debug comande:",
      comande.map((c) => ({ id: c.id, reparto: c.reparto, stato: c.stato }))
    );

    const all = comande;
    const brace = comande.filter((c) => c.reparto === "brace");
    const priority = comande.filter(
      (c) =>
        c.stato === "nuovo" ||
        c.stato === "in_brace" ||
        (c.reparto === "brace" && c.stato === "brace_pronto")
    );

    console.log("🍖 Comande brace:", brace.length);

    return { all, brace, priority };
  }, [comande]);

  const getTabContent = () => {
    let comandesToShow;
    if (activeTab === 0) {
      comandesToShow = filteredComande.priority;
    } else if (activeTab === 1) {
      comandesToShow = filteredComande.brace;
    } else {
      comandesToShow = filteredComande.all;
    }

    if (comandesToShow.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Nessuna comanda trovata
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {activeTab === 0 && "Non ci sono comande prioritarie al momento"}
            {activeTab === 1 && "Non ci sono comande per la brace"}
            {activeTab === 2 && "Non ci sono comande nel sistema"}
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
    <>
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                🔥 Prioritarie
                <Chip
                  label={filteredComande.priority.length}
                  size="small"
                  color="warning"
                />
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                🍖 Solo Brace
                <Chip
                  label={filteredComande.brace.length}
                  size="small"
                  color="primary"
                />
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                📋 Tutte
                <Chip
                  label={filteredComande.all.length}
                  size="small"
                  color="default"
                />
              </Box>
            }
          />
        </Tabs>
      </Paper>

      {getTabContent()}
    </>
  );
}

export default function BracePage() {
  return (
    <DepartmentLayout
      department="bracerista"
      title="Brace"
      icon="🍖"
      description="Preparazione carni e grigliate"
    >
      <BraceContent />
    </DepartmentLayout>
  );
}
