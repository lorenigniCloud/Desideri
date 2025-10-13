"use client";

import {
  useUpdateStatoPiatti,
  useUpdateStatoTuttiPiattiReparto,
} from "@/hooks/useStatoPiatti";
import { sortCategoriesByOrder } from "@/lib/menu-utils";
import {
  getStatoServitoPerCategoria,
  raggruppaDettagliPerCategoria,
} from "@/lib/stato-utils";
import { ComandaCompleta, RepartoType } from "@/lib/supabase";
import { CheckCircle, Restaurant } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import React from "react";

interface StatoComandaActionsProps {
  comanda: ComandaCompleta;
  reparto: RepartoType;
}

export const StatoComandaActions: React.FC<StatoComandaActionsProps> = ({
  comanda,
  reparto,
}) => {
  const updateStatoPiatti = useUpdateStatoPiatti();
  const updateStatoTuttiPiatti = useUpdateStatoTuttiPiattiReparto();

  // Filtra i dettagli per il reparto corrente
  const dettagliReparto = comanda.dettagli_comanda.filter(
    (d) => d.reparto === reparto
  );

  if (dettagliReparto.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        Nessun piatto per il reparto {reparto} in questa comanda.
      </Alert>
    );
  }

  // Raggruppa per categoria
  const dettagliPerCategoria = raggruppaDettagliPerCategoria(dettagliReparto);
  const categorieOrdinate = sortCategoriesByOrder(
    Object.keys(dettagliPerCategoria)
  );

  const handleServiCategoria = async (categoria: string) => {
    const statoTarget = getStatoServitoPerCategoria(categoria);

    try {
      await updateStatoPiatti.mutateAsync({
        comandaId: comanda.id,
        reparto,
        categoria,
        nuovoStato: statoTarget,
      });
    } catch (error) {
      console.error("Errore nell'aggiornamento stato categoria:", error);
    }
  };

  const handleConcludiTutto = async () => {
    try {
      await updateStatoTuttiPiatti.mutateAsync({
        comandaId: comanda.id,
        reparto,
        nuovoStato: "comanda_conclusa",
      });
    } catch (error) {
      console.error("Errore nella conclusione comanda:", error);
    }
  };

  // Logica specifica per reparto
  if (reparto === "brace") {
    const tuttiConclusiBrace = dettagliReparto.every(
      (d) => d.stato === "comanda_conclusa" || d.stato === "cancellato"
    );

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Restaurant />
            <Typography variant="h6">Comanda #{comanda.id} - Brace</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Tavolo {comanda.tavolo} - {comanda.cliente}
          </Typography>

          <Box mb={2}>
            {dettagliReparto.map((dettaglio) => (
              <Box
                key={dettaglio.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="body2">
                  {dettaglio.menu?.nome} x{dettaglio.quantita}
                </Typography>
                <Chip
                  label={
                    dettaglio.stato === "comanda_conclusa"
                      ? "Concluso"
                      : "In Preparazione"
                  }
                  color={
                    dettaglio.stato === "comanda_conclusa"
                      ? "success"
                      : "warning"
                  }
                  size="small"
                />
              </Box>
            ))}
          </Box>

          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleConcludiTutto}
            disabled={tuttiConclusiBrace || updateStatoTuttiPiatti.isPending}
            startIcon={
              updateStatoTuttiPiatti.isPending ? (
                <CircularProgress size={16} />
              ) : (
                <CheckCircle />
              )
            }
          >
            {tuttiConclusiBrace
              ? "Tutto Concluso"
              : updateStatoTuttiPiatti.isPending
              ? "Concludendo..."
              : "Concludi Tutto"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Logica per cucina
  if (reparto === "cucina") {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Restaurant />
            <Typography variant="h6">Comanda #{comanda.id} - Cucina</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Tavolo {comanda.tavolo} - {comanda.cliente}
          </Typography>

          {categorieOrdinate.map((categoria) => {
            const gruppo = dettagliPerCategoria[categoria];
            const tuttiServiti = gruppo.statoAggregato === "tutto_servito";

            return (
              <Box
                key={categoria}
                sx={{
                  mb: 2,
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {categoria}
                  </Typography>
                  <Chip
                    label={
                      gruppo.statoAggregato === "tutto_servito"
                        ? "Tutto Servito"
                        : gruppo.statoAggregato === "parzialmente_servito"
                        ? "Parzialmente Servito"
                        : "In Preparazione"
                    }
                    color={
                      gruppo.statoAggregato === "tutto_servito"
                        ? "success"
                        : gruppo.statoAggregato === "parzialmente_servito"
                        ? "warning"
                        : "info"
                    }
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  {gruppo.dettagli.map((dettaglio) => (
                    <Box
                      key={dettaglio.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={0.5}
                    >
                      <Typography variant="body2">
                        {dettaglio.menu?.nome} x{dettaglio.quantita}
                      </Typography>
                      <Chip
                        label={
                          dettaglio.stato === "in_preparazione"
                            ? "In Preparazione"
                            : dettaglio.stato ===
                              getStatoServitoPerCategoria(categoria)
                            ? "Servito"
                            : "Concluso"
                        }
                        color={
                          dettaglio.stato === "in_preparazione"
                            ? "warning"
                            : "success"
                        }
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleServiCategoria(categoria)}
                  disabled={tuttiServiti || updateStatoPiatti.isPending}
                  startIcon={
                    updateStatoPiatti.isPending ? (
                      <CircularProgress size={16} />
                    ) : (
                      <CheckCircle />
                    )
                  }
                >
                  {tuttiServiti
                    ? `${categoria} Serviti`
                    : updateStatoPiatti.isPending
                    ? "Servendo..."
                    : `Servi ${categoria}`}
                </Button>
              </Box>
            );
          })}

          {/* Bottone per concludere tutto */}
          <Button
            variant="outlined"
            color="success"
            fullWidth
            onClick={handleConcludiTutto}
            disabled={updateStatoTuttiPiatti.isPending}
            sx={{ mt: 2 }}
          >
            {updateStatoTuttiPiatti.isPending
              ? "Concludendo..."
              : "Concludi Tutta la Comanda"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};
