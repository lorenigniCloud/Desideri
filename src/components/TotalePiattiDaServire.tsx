"use client";

import { sortCategoriesByOrder } from "@/lib/menu-utils";
import { DettaglioComanda } from "@/lib/supabase";
import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

interface TotalePiattiDaServireProps {
  comande: Array<{
    id: number;
    cliente: string;
    tavolo: number;
    dettagli_comanda: DettaglioComanda[];
  }>;
  reparto: "cucina" | "brace";
}

export const TotalePiattiDaServire: React.FC<TotalePiattiDaServireProps> = ({
  comande,
  reparto,
}) => {
  // Calcola i totali dei piatti da servire per questo reparto
  const totaliPiatti = useMemo(() => {
    const piattiMap = new Map<
      string,
      { nome: string; quantita: number; categoria: string }
    >();

    comande.forEach((comanda) => {
      comanda.dettagli_comanda
        .filter(
          (dettaglio) => dettaglio.reparto === reparto && !dettaglio.servito
        )
        .forEach((dettaglio) => {
          const key = `${dettaglio.menu_id}-${dettaglio.menu?.nome}`;
          const existing = piattiMap.get(key);

          if (existing) {
            existing.quantita += dettaglio.quantita;
          } else {
            piattiMap.set(key, {
              nome: dettaglio.menu?.nome || "Piatto sconosciuto",
              quantita: dettaglio.quantita,
              categoria: dettaglio.menu?.categoria || "Altro",
            });
          }
        });
    });

    // Raggruppa per categoria
    const raggruppatiPerCategoria = new Map<
      string,
      Array<{ nome: string; quantita: number }>
    >();

    piattiMap.forEach((piatto) => {
      if (!raggruppatiPerCategoria.has(piatto.categoria)) {
        raggruppatiPerCategoria.set(piatto.categoria, []);
      }
      raggruppatiPerCategoria.get(piatto.categoria)!.push({
        nome: piatto.nome,
        quantita: piatto.quantita,
      });
    });

    // Ordina le categorie usando la stessa logica di CreateComandaForm e ComandaCard
    const categorieOrdinate = sortCategoriesByOrder(
      Array.from(raggruppatiPerCategoria.keys())
    );

    // Crea una nuova Map con le categorie ordinate
    const raggruppatiOrdinati = new Map<
      string,
      Array<{ nome: string; quantita: number }>
    >();
    categorieOrdinate.forEach((categoria) => {
      if (raggruppatiPerCategoria.has(categoria)) {
        raggruppatiOrdinati.set(
          categoria,
          raggruppatiPerCategoria.get(categoria)!
        );
      }
    });

    // Ordina i piatti all'interno di ogni categoria
    raggruppatiOrdinati.forEach((piatti) => {
      piatti.sort((a, b) => a.nome.localeCompare(b.nome));
    });

    return raggruppatiOrdinati;
  }, [comande, reparto]);

  const totalePiatti = Array.from(totaliPiatti.values()).reduce(
    (sum, piatti) =>
      sum + piatti.reduce((catSum, piatto) => catSum + piatto.quantita, 0),
    0
  );

  if (totalePiatti === 0) {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">📊 Totali</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="text.secondary">
            Tutti i piatti sono stati serviti! 🎉
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Accordion sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6">📊 Totali</Typography>
          <Chip
            label={`${totalePiatti} piatti da servire`}
            color="warning"
            size="small"
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {Array.from(totaliPiatti.entries()).map(([categoria, piatti]) => (
            <Box key={categoria}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                {categoria}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  ml: 2,
                }}
              >
                {piatti.map((piatto) => (
                  <Box
                    key={`${piatto.nome}-${piatto.quantita}`}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">{piatto.nome}</Typography>
                    <Chip
                      label={piatto.quantita}
                      color="error"
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
