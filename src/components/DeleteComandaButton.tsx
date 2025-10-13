"use client";

import { useDeleteComanda } from "@/hooks/useDeleteComanda";
import { Delete, Warning } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useState } from "react";

interface DeleteComandaButtonProps {
  comandaId: number;
  cliente: string;
  tavolo: number;
  size?: "small" | "medium" | "large";
  variant?: "icon" | "button";
}

export const DeleteComandaButton: React.FC<DeleteComandaButtonProps> = ({
  comandaId,
  cliente,
  tavolo,
  size = "small",
  variant = "icon",
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const deleteComanda = useDeleteComanda();

  const handleDelete = async () => {
    try {
      await deleteComanda.mutateAsync(comandaId);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Errore nell'eliminazione della comanda:", error);
    }
  };

  const getButtonContent = () => {
    if (variant === "button") {
      return (
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => setShowConfirmDialog(true)}
          disabled={deleteComanda.isPending}
          size={size}
        >
          {deleteComanda.isPending ? "Eliminando..." : "Elimina"}
        </Button>
      );
    }

    return (
      <Tooltip title="Elimina comanda">
        <IconButton
          color="error"
          onClick={() => setShowConfirmDialog(true)}
          disabled={deleteComanda.isPending}
          size={size}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <>
      {getButtonContent()}

      {/* Dialog di conferma */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Warning color="error" />
          Conferma Eliminazione
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare la comanda del tavolo{" "}
            <strong>{tavolo}</strong> per <strong>{cliente}</strong>?
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: "error.main" }}>
            ⚠️ Questa azione è irreversibile e eliminerà tutti i dati della
            comanda.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)} color="inherit">
            Annulla
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleteComanda.isPending}
            startIcon={<Delete />}
          >
            {deleteComanda.isPending ? "Eliminando..." : "Elimina Comanda"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
