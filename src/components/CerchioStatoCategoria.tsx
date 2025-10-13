"use client";

import { useAuth } from "@/hooks/useAuth";
import { useServiCategoria } from "@/hooks/useServitoActions";
import {
  canClickCerchioCategoria,
  getColoreCerchioCategoria,
} from "@/lib/servito-utils";
import {
  CATEGORIA_TO_REPARTO,
  DettaglioComanda,
  RepartoType,
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

  console.log("CerchioStatoCategoria", {
    categoria,
    dettagli,
    comandaId,
    size,
  });

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
  const canClick = canClickCerchioCategoria(
    categoria,
    userReparto,
    CATEGORIA_TO_REPARTO
  );

  // Filtra i dettagli per questa categoria
  const dettagliCategoria = dettagli.filter(
    (d) => d.menu?.categoria === categoria
  );
  const tuttiServiti = dettagliCategoria.every((d) => d.servito);

  const handleClick = () => {
    if (!canClick || tuttiServiti || serviCategoria.isPending) {
      return;
    }

    // Mostra la modale di conferma
    setShowConfirmDialog(true);
  };

  const handleConfirmServi = async () => {
    const repartoCategoria = CATEGORIA_TO_REPARTO[categoria];
    if (!repartoCategoria) {
      return;
    }

    try {
      const result = await serviCategoria.mutateAsync({
        comandaId,
        categoria,
        reparto: repartoCategoria,
        servito: true,
      });
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Errore nel servire categoria:", error);
      setShowConfirmDialog(false);
    }
  };

  const getTooltipText = () => {
    if (tuttiServiti) {
      return `${categoria}: Tutto Servito`;
    }

    const servitiCount = dettagliCategoria.filter((d) => d.servito).length;
    const totaleCount = dettagliCategoria.length;

    if (servitiCount === 0) {
      return `${categoria}: Non Servito (0/${totaleCount})`;
    }

    return `${categoria}: Parzialmente Servito (${servitiCount}/${totaleCount})`;
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

  return (
    <>
      <Tooltip title={getTooltipText()}>
        <span>
          <IconButton
            onClick={handleClick}
            disabled={!canClick || tuttiServiti || serviCategoria.isPending}
            size={getSizeValue()}
            sx={{
              color: `${colore}.main`,
              "&:hover":
                canClick && !tuttiServiti
                  ? {
                      backgroundColor: `${colore}.light`,
                      opacity: 0.8,
                    }
                  : {},
              cursor: canClick && !tuttiServiti ? "pointer" : "default",
              padding: size === "small" ? 0.5 : 1,
            }}
          >
            {serviCategoria.isPending ? (
              <CircularProgress
                size={size === "small" ? 16 : size === "large" ? 32 : 24}
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
        <DialogTitle>Conferma Servizio</DialogTitle>
        <DialogContent>
          <Typography>
            Sei sicuro di voler segnare tutti i piatti della categoria{" "}
            <strong>{categoria}</strong> come serviti?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Questa azione segnerà {dettagliCategoria.length} piatti come
            serviti.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)} color="inherit">
            Annulla
          </Button>
          <Button
            onClick={handleConfirmServi}
            variant="contained"
            color="success"
            disabled={serviCategoria.isPending}
          >
            {serviCategoria.isPending ? "Servendo..." : "Conferma"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
