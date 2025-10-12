"use client";

import { useUpdateComanda } from "@/hooks/useComande";
import { ComandaCompleta, StatoComanda } from "@/lib/supabase";
import { UserRole } from "@/types/auth";
import {
  AccessTime,
  Person,
  Restaurant,
  TableRestaurant,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import React from "react";

interface ComandaCardProps {
  comanda: ComandaCompleta;
  currentUserRole: UserRole;
}

export const ComandaCard: React.FC<ComandaCardProps> = ({
  comanda,
  currentUserRole,
}) => {
  const updateComanda = useUpdateComanda();

  const getStatusColor = (stato: StatoComanda) => {
    switch (stato) {
      case "nuovo":
        return "info";
      case "in_brace":
      case "in_cucina":
        return "warning";
      case "brace_pronto":
      case "cucina_pronto":
        return "success";
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
      in_brace: "In Brace",
      brace_pronto: "Brace Pronto",
      in_cucina: "In Cucina",
      cucina_pronto: "Cucina Pronto",
      servito: "Servito",
      cancellato: "Cancellato",
    };
    return labels[stato];
  };

  const getAvailableActions = (stato: StatoComanda, reparto: string) => {
    const actions: {
      label: string;
      newStatus: StatoComanda;
      color?: string;
    }[] = [];

    if (currentUserRole === "bracerista" && reparto === "brace") {
      if (stato === "nuovo") {
        actions.push({
          label: "Inizia Preparazione",
          newStatus: "in_brace",
          color: "primary",
        });
      } else if (stato === "in_brace") {
        actions.push({
          label: "Segna Pronto",
          newStatus: "brace_pronto",
          color: "success",
        });
      }
    }

    if (currentUserRole === "cuoca" && reparto === "cucina") {
      if (stato === "nuovo") {
        actions.push({
          label: "Inizia Preparazione",
          newStatus: "in_cucina",
          color: "primary",
        });
      } else if (stato === "in_cucina") {
        actions.push({
          label: "Segna Pronto",
          newStatus: "cucina_pronto",
          color: "success",
        });
      }
    }

    if (currentUserRole === "cassiere") {
      if (stato === "brace_pronto" || stato === "cucina_pronto") {
        actions.push({
          label: "Segna Servito",
          newStatus: "servito",
          color: "success",
        });
      }
      if (stato !== "servito" && stato !== "cancellato") {
        actions.push({
          label: "Cancella",
          newStatus: "cancellato",
          color: "error",
        });
      }
    }

    return actions;
  };

  const handleStatusChange = async (newStatus: StatoComanda) => {
    try {
      await updateComanda.mutateAsync({
        id: comanda.id,
        stato: newStatus,
      });
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato:", error);
    }
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

  const availableActions = getAvailableActions(comanda.stato, comanda.reparto);
  const canModify =
    currentUserRole === "cassiere" ||
    (currentUserRole === "bracerista" && comanda.reparto === "brace") ||
    (currentUserRole === "cuoca" && comanda.reparto === "cucina");

  return (
    <Card
      sx={{
        mb: 2,
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
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="start"
          mb={2}
        >
          <Box>
            <Typography variant="h6" component="h3">
              Comanda #{comanda.id}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Person fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {comanda.cliente}
              </Typography>
            </Box>
          </Box>

          <Box textAlign="right">
            <Chip
              label={getStatusLabel(comanda.stato)}
              color={getStatusColor(comanda.stato) as any}
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary" display="block">
              <AccessTime
                fontSize="small"
                sx={{ mr: 0.5, verticalAlign: "middle" }}
              />
              {formatDate(comanda.data_ordine)}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={0.5}>
            <TableRestaurant fontSize="small" />
            <Typography variant="body2">Tavolo {comanda.tavolo}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={0.5}>
            <Person fontSize="small" />
            <Typography variant="body2">{comanda.nome_cameriere}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={0.5}>
            <Restaurant fontSize="small" />
            <Typography variant="body2">
              Reparto:{" "}
              {comanda.reparto.charAt(0).toUpperCase() +
                comanda.reparto.slice(1)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Piatti ordinati:
        </Typography>
        <Box sx={{ mb: 2 }}>
          {comanda.dettagli_comanda.map((dettaglio) => (
            <Box
              key={dettaglio.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ py: 0.5 }}
            >
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {dettaglio.menu?.nome}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {dettaglio.menu?.categoria}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="body2">
                  {dettaglio.quantita}x €{dettaglio.prezzo_unitario.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  €{(dettaglio.quantita * dettaglio.prezzo_unitario).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            Totale: €{comanda.totale.toFixed(2)}
          </Typography>
        </Box>

        {comanda.note && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> {comanda.note}
            </Typography>
          </Box>
        )}

        {canModify && availableActions.length > 0 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Azioni disponibili:
            </Typography>
            <ButtonGroup variant="outlined" size="small">
              {availableActions.map((action) => (
                <Button
                  key={action.newStatus}
                  onClick={() => handleStatusChange(action.newStatus)}
                  disabled={updateComanda.isPending}
                  color={action.color as any}
                >
                  {action.label}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
        )}

        {!canModify && availableActions.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
            >
              ⚠️ Solo gli utenti del reparto {comanda.reparto} possono
              modificare questa comanda
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
