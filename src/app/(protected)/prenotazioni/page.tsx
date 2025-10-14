"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { PrenotazioneDialog } from "@/components/PrenotazioneDialog";
import { TableCard } from "@/components/TableCard";
import { usePrenotazioniByGiornoTurno } from "@/hooks/usePrenotazioni";
import {
  formatTurno,
  formatZonaName,
  getNumeroTavoliZona,
  TURNI,
  TurnoValue,
  ZONE,
} from "@/lib/prenotazioni-config";
import { Prenotazione } from "@/types/prenotazioni";
import { CalendarMonth, FilterList } from "@mui/icons-material";
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

function PrenotazioniContent() {
  // Stato filtri
  const [selectedGiorno, setSelectedGiorno] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedTurno, setSelectedTurno] = useState<number>(1);

  // Stato dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<{
    zona: string;
    numeroTavolo: number;
  } | null>(null);

  // Fetch prenotazioni
  const {
    data: prenotazioni,
    isLoading,
    error,
  } = usePrenotazioniByGiornoTurno(selectedGiorno, selectedTurno);

  // Giorni disponibili specifici
  const giorniDisponibili = useMemo(() => {
    return [
      "2024-10-17",
      "2024-10-18",
      "2024-10-19",
      "2024-10-24",
      "2024-10-25",
      "2024-10-26",
    ];
  }, []);

  // Raggruppa prenotazioni per zona e tavolo
  const prenotazioniPerTavolo = useMemo(() => {
    if (!prenotazioni) return new Map<string, Prenotazione[]>();

    const map = new Map<string, Prenotazione[]>();
    prenotazioni.forEach((p) => {
      const key = `${p.zona}-${p.numero_tavolo}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(p);
    });
    return map;
  }, [prenotazioni]);

  const handleOpenDialog = (zona: string, numeroTavolo: number) => {
    setSelectedTable({ zona, numeroTavolo });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTable(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          📅 Gestione Prenotazioni
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestisci le prenotazioni dei tavoli per giorno e turno
        </Typography>
      </Box>

      {/* Filtri */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <FilterList />
          <Typography variant="h6">Filtri</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Giorno</InputLabel>
            <Select
              value={selectedGiorno}
              onChange={(e) => setSelectedGiorno(e.target.value)}
              label="Giorno"
              startAdornment={<CalendarMonth sx={{ mr: 1 }} />}
            >
              {giorniDisponibili.map((giorno) => (
                <MenuItem key={giorno} value={giorno}>
                  {formatDate(giorno)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Turno</InputLabel>
            <Select
              value={selectedTurno}
              onChange={(e) => setSelectedTurno(Number(e.target.value))}
              label="Turno"
            >
              {TURNI.map((turno) => (
                <MenuItem key={turno.value} value={turno.value}>
                  {turno.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            Visualizzando:{" "}
            <strong>
              {formatDate(selectedGiorno)} -{" "}
              {formatTurno(selectedTurno as TurnoValue)}
            </strong>
          </Typography>
        </Box>
      </Paper>

      {/* Loading/Error */}
      {isLoading && (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Errore nel caricamento delle prenotazioni
        </Alert>
      )}

      {/* Tavoli per zona */}
      {!isLoading && !error && (
        <Box>
          {ZONE.map((zona) => {
            const numeroTavoli = getNumeroTavoliZona(zona);

            return (
              <Box key={zona} sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                  {formatZonaName(zona)}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  {Array.from({ length: numeroTavoli }, (_, i) => i + 1).map(
                    (numeroTavolo) => {
                      const key = `${zona}-${numeroTavolo}`;
                      const prenotazioniTavolo =
                        prenotazioniPerTavolo.get(key) || [];

                      return (
                        <TableCard
                          key={numeroTavolo}
                          zona={zona}
                          numeroTavolo={numeroTavolo}
                          prenotazioni={prenotazioniTavolo}
                          onAddPrenotazione={() =>
                            handleOpenDialog(zona, numeroTavolo)
                          }
                          onViewPrenotazioni={() =>
                            handleOpenDialog(zona, numeroTavolo)
                          }
                        />
                      );
                    }
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Dialog Prenotazioni */}
      {selectedTable && (
        <PrenotazioneDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          giorno={selectedGiorno}
          turno={selectedTurno}
          zona={selectedTable.zona}
          numeroTavolo={selectedTable.numeroTavolo}
          prenotazioni={
            prenotazioniPerTavolo.get(
              `${selectedTable.zona}-${selectedTable.numeroTavolo}`
            ) || []
          }
        />
      )}
    </Box>
  );
}

export default function PrenotazioniPage() {
  return (
    <AuthGuard requiredRole="gestore-prenotazioni">
      <PrenotazioniContent />
    </AuthGuard>
  );
}
