"use client";

import { useAuth } from "@/hooks/useAuth";
import { ComandaCompleta, StatoComanda } from "@/lib/supabase";
import {
  AccessTime,
  ExpandMore,
  Person,
  TableRestaurant,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

interface ComandaCardProps {
  comanda: ComandaCompleta;
}

export const ComandaCard: React.FC<ComandaCardProps> = ({ comanda }) => {
  const [expanded, setExpanded] = useState(false);
  const { canSeeCliente, canSeePrices } = useAuth();

  const getStatusColor = (stato: StatoComanda) => {
    switch (stato) {
      case "nuovo":
        return "info";
      case "comanda_ricevuta":
        return "warning";
      case "comanda_preparata":
        return "success";
      case "comanda_conclusa":
        return "primary";
      case "servito":
        return "default";
      case "cancellato":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (stato: StatoComanda) => {
    const labels: Record<StatoComanda, string> = {
      nuovo: "Nuovo",
      comanda_ricevuta: "Comanda Ricevuta",
      comanda_preparata: "Comanda Preparata",
      comanda_conclusa: "Comanda Conclusa",
      servito: "Servito",
      cancellato: "Cancellato",
    };
    return labels[stato];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      sx={{
        mb: 2,
        maxHeight: expanded ? "none" : "300px",
        overflow: "hidden",
        border: 2,
        borderColor:
          comanda.stato === "nuovo"
            ? "info.main"
            : comanda.stato.includes("pronto")
            ? "success.main"
            : comanda.stato.includes("in_")
            ? "warning.main"
            : "divider",
        "&:hover": {
          boxShadow: 4,
        },
        transition: "max-height 0.3s ease-in-out",
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Riga 1: Comanda #ID - Stato */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6" component="h3">
            Comanda #{comanda.id}
          </Typography>
          <Chip
            label={getStatusLabel(comanda.stato)}
            color={
              getStatusColor(comanda.stato) as
                | "default"
                | "primary"
                | "secondary"
                | "error"
                | "info"
                | "success"
                | "warning"
            }
            size="small"
          />
        </Box>

        {/* Riga 2: Orario */}
        <Box display="flex" alignItems="center" mb={1}>
          <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(comanda.data_ordine)}
          </Typography>
        </Box>

        {/* Riga 3: Tavolo e Cameriere */}
        <Box display="flex" gap={2} mb={1} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={0.5}>
            <TableRestaurant fontSize="small" />
            <Typography variant="body2">Tavolo {comanda.tavolo}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={0.5}>
            <Person fontSize="small" />
            <Typography variant="body2">{comanda.nome_cameriere}</Typography>
          </Box>

          {canSeeCliente() && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Person fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {comanda.cliente}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2">
            Piatti ordinati ({comanda.dettagli_comanda.length})
          </Typography>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            <ExpandMore />
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Box>
            {(() => {
              // Ordine delle categorie del menu
              const categoriaOrder = [
                "Antipasti",
                "Primi Piatti",
                "Secondi Piatti",
                "Contorni",
                "Dolci",
                "Bevande",
                "Servizio",
              ];

              // Raggruppa i dettagli per categoria
              const dettagliByCategoria = comanda.dettagli_comanda.reduce(
                (acc, dettaglio) => {
                  const categoria = dettaglio.menu?.categoria || "Altro";
                  if (!acc[categoria]) {
                    acc[categoria] = [];
                  }
                  acc[categoria].push(dettaglio);
                  return acc;
                },
                {} as Record<string, typeof comanda.dettagli_comanda>
              );

              // Ordina le categorie secondo l'ordine del menu
              const categorieOrdinate = categoriaOrder.filter(
                (cat) =>
                  dettagliByCategoria[cat] &&
                  dettagliByCategoria[cat].length > 0
              );

              return categorieOrdinate.map((categoria) => (
                <Box key={categoria} sx={{ mb: 2 }}>
                  {/* Header categoria */}
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      ml: 2,
                      borderBottom: 1,
                      borderColor: "divider",
                      pb: 0.5,
                    }}
                  >
                    {categoria}
                  </Typography>

                  {/* Piatti della categoria */}
                  {dettagliByCategoria[categoria].map((dettaglio) => (
                    <Box
                      key={dettaglio.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ py: 0.5, ml: 4 }}
                    >
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                        gap={1}
                        sx={{ flex: 1 }}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          {dettaglio.menu?.nome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {dettaglio.quantita}
                        </Typography>
                      </Box>
                      {canSeePrices() && (
                        <Box textAlign="right">
                          <Typography variant="body2">
                            {dettaglio.quantita}x €
                            {dettaglio.prezzo_unitario.toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            €
                            {(
                              dettaglio.quantita * dettaglio.prezzo_unitario
                            ).toFixed(2)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              ));
            })()}
          </Box>
        </Collapse>

        <Divider sx={{ mt: 1 }} />

        {canSeePrices() && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Totale: €{comanda.totale.toFixed(2)}
            </Typography>
          </Box>
        )}

        {comanda.note && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> {comanda.note}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
