"use client";

import { useAuth } from "@/hooks/useAuth";
import { useServiCategoria } from "@/hooks/useServitoActions";
import {
  canClickCerchioCategoria,
  getColoreCerchioCategoria,
} from "@/lib/servito-utils";
import {
  DettaglioComanda,
  RepartoType,
  getRepartoFromCategoriaWithExceptions,
} from "@/lib/supabase";
import { Circle } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

interface CerchioStatoCategoriaProps {
  categoria: string;
  dettagli: DettaglioComanda[];
  comandaId: number;
  size?: "small" | "medium" | "large";
}

export const CerchioStatoCategoria: React.FC<CerchioStatoCategoriaProps> = ({
  categoria,
  dettagli,
  comandaId,
  size = "medium",
}) => {
  const { role } = useAuth();
  const serviCategoria = useServiCategoria();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Determina il reparto dell'utente basato sul ruolo
  const getUserReparto = (): RepartoType | null => {
    switch (role) {
      case "cuoca":
        return "cucina";
      case "bracerista":
        return "brace";
      case "cassiere":
        return "cassa";
      default:
        return null;
    }
  };

  const userReparto = getUserReparto();
  const colore = getColoreCerchioCategoria(dettagli, categoria);

  // Determina il reparto della categoria considerando le eccezioni
  const repartoCategoria = getRepartoFromCategoriaWithExceptions(
    categoria,
    dettagli
  );

  const canClick = canClickCerchioCategoria(categoria, userReparto, {
    [categoria]: repartoCategoria,
  });

  // Filtra i dettagli per questa categoria
  const dettagliCategoria = dettagli.filter(
    (d) => d.menu?.categoria === categoria
  );
  const tuttiServiti = dettagliCategoria.every((d) => d.servito);

  const handleClick = () => {
    if (!canClick || serviCategoria.isPending) {
      return;
    }

    // Mostra la modale di conferma
    setShowConfirmDialog(true);
  };

  const handleConfirmServi = async () => {
    try {
      // Toggle: se tutti serviti, metti a false, altrimenti a true
      const nuovoStato = !tuttiServiti;

      await serviCategoria.mutateAsync({
        comandaId,
        categoria,
        reparto: repartoCategoria,
        servito: nuovoStato,
      });
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Errore nel servire categoria:", error);
      setShowConfirmDialog(false);
    }
  };

  const getTooltipText = () => {
    const servitiCount = dettagliCategoria.filter((d) => d.servito).length;
    const totaleCount = dettagliCategoria.length;

    if (tuttiServiti) {
      return `${categoria}: Tutto Servito - Clicca per riportare a non servito`;
    }

    if (servitiCount === 0) {
      return `${categoria}: Non Servito (0/${totaleCount}) - Clicca per servire`;
    }

    return `${categoria}: Parzialmente Servito (${servitiCount}/${totaleCount}) - Clicca per servire tutto`;
  };

  const getSizeValue = () => {
    switch (size) {
      case "small":
        return "small" as const;
      case "large":
        return "large" as const;
      case "medium":
      default:
        return "medium" as const;
    }
  };

  const getCircularProgressSize = () => {
    if (size === "small") return 16;
    if (size === "large") return 32;
    return 24;
  };

  return (
    <>
      <Tooltip title={getTooltipText()}>
        <span>
          <IconButton
            onClick={handleClick}
            disabled={!canClick || serviCategoria.isPending}
            size={getSizeValue()}
            sx={{
              color: `${colore}.main`,
              "&:hover": canClick
                ? {
                    backgroundColor: `${colore}.light`,
                    opacity: 0.8,
                  }
                : {},
              cursor: canClick ? "pointer" : "default",
              padding: size === "small" ? 0.5 : 1,
            }}
            style={{
              // Debug: forziamo il colore verde per test
              color: colore === "success" ? "#4caf50" : undefined,
            }}
          >
            {serviCategoria.isPending ? (
              <CircularProgress
                size={getCircularProgressSize()}
                color={colore}
              />
            ) : (
              <Circle fontSize={getSizeValue()} />
            )}
          </IconButton>
        </span>
      </Tooltip>
      {/* Modale di conferma */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {tuttiServiti ? "Riporta a Non Servito" : "Conferma Servizio"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {tuttiServiti ? (
              <>
                Sei sicuro di voler riportare tutti i piatti della categoria{" "}
                <strong>{categoria}</strong> a non serviti?
              </>
            ) : (
              <>
                Sei sicuro di voler segnare tutti i piatti della categoria{" "}
                <strong>{categoria}</strong> come serviti?
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)} color="inherit">
            Annulla
          </Button>
          <Button
            onClick={handleConfirmServi}
            variant="contained"
            color={tuttiServiti ? "warning" : "success"}
            disabled={serviCategoria.isPending}
          >
            {(() => {
              if (serviCategoria.isPending) {
                return tuttiServiti ? "Riportando..." : "Servendo...";
              }
              return tuttiServiti ? "Riporta" : "Conferma";
            })()}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
