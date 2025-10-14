"use client";

import {
  useCreatePrenotazione,
  useDeletePrenotazione,
} from "@/hooks/usePrenotazioni";
import { getCapienzaTavolo, TurnoValue, Zona } from "@/lib/prenotazioni-config";
import { CreatePrenotazioneRequest, Prenotazione } from "@/types/prenotazioni";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete, Person, Phone } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const prenotazioneSchema = z.object({
  nome_cliente: z.string().min(1, "Nome cliente è obbligatorio").trim(),
  numero_persone: z
    .number()
    .min(1, "Almeno 1 persona")
    .max(20, "Massimo 20 persone")
    .nullable(),
  recapito_telefonico: z
    .string()
    .min(1, "Recapito telefonico è obbligatorio")
    .trim(),
  note: z.string().optional(),
});

type PrenotazioneFormData = {
  nome_cliente: string;
  numero_persone: number | null;
  recapito_telefonico: string;
  note?: string;
};

interface PrenotazioneDialogProps {
  open: boolean;
  onClose: () => void;
  giorno: string;
  turno: number;
  zona: string;
  numeroTavolo: number;
  prenotazioni: Prenotazione[];
}

export const PrenotazioneDialog: React.FC<PrenotazioneDialogProps> = ({
  open,
  onClose,
  giorno,
  turno,
  zona,
  numeroTavolo,
  prenotazioni,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [prenotazioneToDelete, setPrenotazioneToDelete] =
    useState<Prenotazione | null>(null);
  const createPrenotazione = useCreatePrenotazione();
  const deletePrenotazione = useDeletePrenotazione();

  const capienza = getCapienzaTavolo(zona as Zona, numeroTavolo);
  const postiOccupati = prenotazioni.reduce(
    (sum, p) => sum + p.numero_persone,
    0
  );
  const postiDisponibili = capienza - postiOccupati;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PrenotazioneFormData>({
    resolver: zodResolver(prenotazioneSchema),
    defaultValues: {
      nome_cliente: "",
      numero_persone: null,
      recapito_telefonico: "",
      note: "",
    },
  });

  const handleClose = () => {
    setShowForm(false);
    reset();
    onClose();
  };

  const onSubmit = async (data: PrenotazioneFormData) => {
    if (!data.numero_persone || data.numero_persone > postiDisponibili) {
      return;
    }

    const prenotazioneData: CreatePrenotazioneRequest = {
      giorno: giorno,
      turno: turno as TurnoValue,
      zona: zona as Zona,
      numero_tavolo: numeroTavolo,
      nome_cliente: data.nome_cliente,
      numero_persone: data.numero_persone,
      recapito_telefonico: data.recapito_telefonico,
      note: data.note || undefined,
    };

    try {
      await createPrenotazione.mutateAsync(prenotazioneData);
      reset();
      setShowForm(false);
    } catch (error) {
      console.error("Errore nella creazione della prenotazione:", error);
    }
  };

  const handleDeleteClick = (prenotazione: Prenotazione) => {
    setPrenotazioneToDelete(prenotazione);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!prenotazioneToDelete) return;

    try {
      await deletePrenotazione.mutateAsync(prenotazioneToDelete.id);
      setDeleteDialogOpen(false);
      setPrenotazioneToDelete(null);
    } catch (error) {
      console.error("Errore nell'eliminazione della prenotazione:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPrenotazioneToDelete(null);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Tavolo {numeroTavolo} - {zona}
        <Typography variant="body2" color="text.secondary">
          {new Date(giorno).toLocaleDateString("it-IT")} - Turno {turno}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Info capienza */}
        <Box
          sx={{
            p: 2,
            mb: 2,
            bgcolor: "background.default",
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            <strong>Capienza:</strong> {capienza} posti
          </Typography>
          <Typography variant="body2">
            <strong>Occupati:</strong> {postiOccupati} posti
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: postiDisponibili === 0 ? "error.main" : "success.main",
              fontWeight: "bold",
            }}
          >
            <strong>Disponibili:</strong> {postiDisponibili} posti
          </Typography>
        </Box>

        {/* Lista prenotazioni esistenti */}
        {prenotazioni.length > 0 && (
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              Prenotazioni ({prenotazioni.length})
            </Typography>
            <List dense>
              {prenotazioni.map((prenotazione) => (
                <ListItem
                  key={prenotazione.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleDeleteClick(prenotazione)}
                      disabled={deletePrenotazione.isPending}
                    >
                      <Delete />
                    </IconButton>
                  }
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Person fontSize="small" />
                      <Typography variant="body1" fontWeight="bold">
                        {prenotazione.nome_cliente}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      👥 {prenotazione.numero_persone} person
                      {prenotazione.numero_persone === 1 ? "a" : "e"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📞 {prenotazione.recapito_telefonico}
                    </Typography>
                    {prenotazione.note && (
                      <Typography variant="caption" color="text.secondary">
                        📝 {prenotazione.note}
                      </Typography>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Form nuova prenotazione */}
        {!showForm && postiDisponibili > 0 && (
          <Button
            variant="contained"
            fullWidth
            onClick={() => setShowForm(true)}
            disabled={postiDisponibili === 0}
          >
            + Aggiungi Prenotazione
          </Button>
        )}

        {showForm && (
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" gutterBottom>
              Nuova Prenotazione
            </Typography>

            <Controller
              name="nome_cliente"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Nome Cliente"
                  error={!!errors.nome_cliente}
                  helperText={errors.nome_cliente?.message}
                  required
                  sx={{ mb: 2 }}
                  slotProps={{
                    input: {
                      startAdornment: <Person sx={{ mr: 1 }} />,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="numero_persone"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Numero Persone"
                  type="number"
                  value={value ?? ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue === "") {
                      onChange(null);
                    } else {
                      const numValue = Number(newValue);
                      if (!isNaN(numValue)) {
                        onChange(numValue);
                      }
                    }
                  }}
                  error={!!errors.numero_persone}
                  helperText={
                    errors.numero_persone?.message ||
                    `Massimo ${postiDisponibili} posti disponibili`
                  }
                  required
                  sx={{ mb: 2 }}
                  slotProps={{
                    htmlInput: { min: 1, max: postiDisponibili },
                  }}
                />
              )}
            />

            <Controller
              name="recapito_telefonico"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Recapito Telefonico"
                  error={!!errors.recapito_telefonico}
                  helperText={errors.recapito_telefonico?.message}
                  required
                  sx={{ mb: 2 }}
                  slotProps={{
                    input: {
                      startAdornment: <Phone sx={{ mr: 1 }} />,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Note (opzionale)"
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
              )}
            />

            {createPrenotazione.error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Errore nella creazione della prenotazione
              </Alert>
            )}

            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
                fullWidth
              >
                Annulla
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={createPrenotazione.isPending}
              >
                {createPrenotazione.isPending ? "Creazione..." : "Conferma"}
              </Button>
            </Box>
          </Box>
        )}

        {postiDisponibili === 0 && !showForm && (
          <Alert severity="warning">
            Tavolo completo - Nessun posto disponibile
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Chiudi
        </Button>
      </DialogActions>

      {/* Modale di conferma eliminazione */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare la prenotazione di{" "}
            <strong>{prenotazioneToDelete?.nome_cliente}</strong>?
          </DialogContentText>
          <DialogContentText sx={{ mt: 1, color: "error.main" }}>
            ⚠️ Questa azione è irreversibile.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Annulla
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deletePrenotazione.isPending}
          >
            {deletePrenotazione.isPending ? "Eliminazione..." : "Elimina"}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};
