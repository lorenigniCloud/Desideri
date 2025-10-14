"use client";

import { getCapienzaTavolo, Zona } from "@/lib/prenotazioni-config";
import { Prenotazione, TavoloInfo } from "@/types/prenotazioni";
import { Box, Typography } from "@mui/material";
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

  const getTableColor = () => {
    if (tavoloInfo.posti_disponibili === 0) return "#f44336"; // Rosso - Completo
    if (tavoloInfo.posti_disponibili < tavoloInfo.capienza / 2)
      return "#ff9800"; // Arancione - Quasi pieno
    return "#4caf50"; // Verde - Disponibile
  };

  const handleClick = () => {
    if (prenotazioni.length > 0) {
      onViewPrenotazioni();
    } else if (tavoloInfo.posti_disponibili > 0) {
      onAddPrenotazione();
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Tavolo rettangolare visto dall'alto */}
      <Box
        onClick={handleClick}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor:
            tavoloInfo.posti_disponibili > 0 || prenotazioni.length > 0
              ? "pointer"
              : "default",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px) scale(1.02)",
          },
          opacity:
            tavoloInfo.posti_disponibili === 0 && prenotazioni.length === 0
              ? 0.6
              : 1,
        }}
      >
        {/* Tavolo rettangolare */}
        <Box
          sx={{
            width: 120,
            height: 60,
            backgroundColor: getTableColor(),
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            "&::before": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: 1,
              background: `linear-gradient(45deg, ${getTableColor()}80, ${getTableColor()})`,
              zIndex: 1,
            },
          }}
        >
          {/* Sedie attorno al tavolo rettangolare */}
          {Array.from({ length: Math.min(tavoloInfo.capienza, 8) }, (_, i) => {
            // Posizionamento delle sedie attorno al tavolo rettangolare
            const positions = [
              { x: -15, y: 0 }, // Sinistra
              { x: 15, y: 0 }, // Destra
              { x: 0, y: -15 }, // Sopra
              { x: 0, y: 15 }, // Sotto
              { x: -10, y: -10 }, // Angolo alto-sinistra
              { x: 10, y: -10 }, // Angolo alto-destra
              { x: -10, y: 10 }, // Angolo basso-sinistra
              { x: 10, y: 10 }, // Angolo basso-destra
            ];

            const pos = positions[i] || { x: 0, y: 0 };

            return (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor:
                    i < tavoloInfo.posti_occupati ? "#9c27b0" : "#ccc",
                  border: "1px solid #333",
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                }}
              />
            );
          })}

          {/* Numero tavolo al centro */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              color: "white",
              zIndex: 3,
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            {numeroTavolo}
          </Typography>
        </Box>

        {/* Info capienza e disponibilità */}
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            right: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <Typography variant="caption" fontWeight="bold">
            Capienza: {tavoloInfo.capienza}
          </Typography>
          <Typography
            variant="caption"
            fontWeight="bold"
            sx={{
              color:
                tavoloInfo.posti_disponibili === 0
                  ? "error.main"
                  : "success.main",
            }}
          >
            Disponibili: {tavoloInfo.posti_disponibili}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
