"use client";

import { getCapienzaTavolo, Zona } from "@/lib/prenotazioni-config";
import { Prenotazione, TavoloInfo } from "@/types/prenotazioni";
import { EventSeat, People, PersonAdd } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";

interface TableCardProps {
  zona: string;
  numeroTavolo: number;
  prenotazioni: Prenotazione[];
  onAddPrenotazione: () => void;
  onViewPrenotazioni: () => void;
}

export const TableCard: React.FC<TableCardProps> = ({
  zona,
  numeroTavolo,
  prenotazioni,
  onAddPrenotazione,
  onViewPrenotazioni,
}) => {
  const tavoloInfo: TavoloInfo = useMemo(() => {
    const capienza = getCapienzaTavolo(zona as Zona, numeroTavolo);
    const postiOccupati = prenotazioni.reduce(
      (sum, p) => sum + p.numero_persone,
      0
    );
    const postiDisponibili = capienza - postiOccupati;

    return {
      zona: zona as Zona,
      numero_tavolo: numeroTavolo,
      capienza,
      posti_occupati: postiOccupati,
      posti_disponibili: postiDisponibili,
      prenotazioni,
    };
  }, [zona, numeroTavolo, prenotazioni]);

  const getStatusColor = () => {
    if (tavoloInfo.posti_disponibili === 0) return "error.main";
    if (tavoloInfo.posti_disponibili < tavoloInfo.capienza / 2)
      return "warning.main";
    return "success.main";
  };

  const getStatusLabel = () => {
    if (tavoloInfo.posti_disponibili === 0) return "Completo";
    if (tavoloInfo.posti_disponibili < tavoloInfo.capienza / 2)
      return "Quasi Pieno";
    return "Disponibile";
  };

  const handleClick = () => {
    if (prenotazioni.length > 0) {
      onViewPrenotazioni();
    } else if (tavoloInfo.posti_disponibili > 0) {
      onAddPrenotazione();
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        border: 2,
        borderColor: getStatusColor(),
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardActionArea
        onClick={handleClick}
        disabled={
          tavoloInfo.posti_disponibili === 0 && prenotazioni.length === 0
        }
        sx={{ height: "100%" }}
      >
        <CardContent>
          {/* Header con numero tavolo */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <EventSeat fontSize="large" color="primary" />
              <Typography variant="h5" fontWeight="bold">
                Tavolo {numeroTavolo}
              </Typography>
            </Box>
            <Chip
              label={getStatusLabel()}
              color={(() => {
                if (tavoloInfo.posti_disponibili === 0) return "error";
                if (tavoloInfo.posti_disponibili < tavoloInfo.capienza / 2)
                  return "warning";
                return "success";
              })()}
              size="small"
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Info posti */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <People fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Capienza: <strong>{tavoloInfo.capienza}</strong> posti
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <PersonAdd fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Disponibili:{" "}
                <strong
                  style={{
                    color:
                      tavoloInfo.posti_disponibili === 0 ? "red" : "inherit",
                  }}
                >
                  {tavoloInfo.posti_disponibili}
                </strong>{" "}
                posti
              </Typography>
            </Box>

            {prenotazioni.length > 0 && (
              <Box mt={1}>
                <Typography variant="caption" color="primary" fontWeight="bold">
                  {prenotazioni.length} prenotazion
                  {prenotazioni.length === 1 ? "e" : "i"}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Azione suggerita */}
          <Box mt={2}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              {(() => {
                if (prenotazioni.length > 0)
                  return "Clicca per visualizzare prenotazioni";
                if (tavoloInfo.posti_disponibili > 0)
                  return "Clicca per aggiungere prenotazione";
                return "Tavolo completo";
              })()}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
