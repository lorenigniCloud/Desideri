"use client";

import { MenuItemSimple } from "@/components/MenuItemSimple";
import { useCreateComanda } from "@/hooks/useComande";
import { useMenuByCategory } from "@/hooks/useMenu";
import { CAMERIERI } from "@/lib/supabase";
import { CreateComandaRequest, PiattoComanda } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExpandMore,
  Note,
  Person,
  ShoppingCart,
  TableRestaurant,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Schema di validazione Zod
const comandaSchema = z.object({
  cliente: z.string().min(1, "Nome cliente è obbligatorio").trim(),
  nome_cameriere: z.string().min(1, "Nome cameriere è obbligatorio").trim(),
  tavolo: z
    .union([
      z.number().min(1, "Il numero tavolo deve essere almeno 1"),
      z.string().min(1, "Il numero tavolo è obbligatorio"),
    ])
    .transform((val) => {
      if (typeof val === "string") {
        const numVal = Number(val);
        if (isNaN(numVal) || numVal < 1) {
          throw new Error("Il numero tavolo deve essere almeno 1");
        }
        return numVal;
      }
      return val;
    }),
  note: z.string().optional(),
});

type ComandaFormData = {
  cliente: string;
  nome_cameriere: string;
  tavolo: number | string;
  note?: string;
};

export const CreateComandaForm: React.FC = () => {
  const [quantities, setQuantities] = useState<Record<number, number | null>>(
    {}
  );
  const [showItemsError, setShowItemsError] = useState(false);

  const { data: menuByCategory, isLoading: menuLoading } = useMenuByCategory();
  const createComanda = useCreateComanda();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ComandaFormData>({
    resolver: zodResolver(comandaSchema),
    defaultValues: {
      cliente: "",
      nome_cameriere: "",
      tavolo: 1,
      note: "",
    },
    mode: "onChange",
  });

  // Gestione quantità
  const handleQuantityChange = (itemId: number, quantity: number | null) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  // Calcolo totale e piatti per la comanda
  const { totalPrice, selectedItems } = useMemo(() => {
    if (!menuByCategory) return { totalPrice: 0, selectedItems: [] };

    const items: PiattoComanda[] = [];
    let total = 0;

    Object.entries(menuByCategory).forEach(([, categoryItems]) => {
      categoryItems.forEach((item) => {
        const quantity = quantities[item.id] ?? 0;
        if (quantity > 0) {
          items.push({
            menu_id: item.id,
            quantita: quantity,
            prezzo_unitario: item.prezzo,
          });
          total += quantity * item.prezzo;
        }
      });
    });

    return { totalPrice: total, selectedItems: items };
  }, [quantities, menuByCategory]);

  // Validazione per il pulsante (solo campi form, non piatti)
  const isFormValid = useMemo(() => {
    return !errors.cliente && !errors.nome_cameriere && !errors.tavolo;
  }, [errors]);

  const getValidationMessage = () => {
    if (errors.cliente) {
      return "Nome cliente è obbligatorio";
    }
    if (errors.nome_cameriere) {
      return "Seleziona un cameriere";
    }
    if (errors.tavolo) {
      return "Numero tavolo è obbligatorio";
    }
    return null;
  };

  const onSubmit = async (data: ComandaFormData) => {
    // Controllo piatti selezionati solo all'onSubmit
    if (selectedItems.length === 0) {
      setShowItemsError(true);
      return;
    }

    // Nascondi errore piatti se ci sono piatti selezionati
    setShowItemsError(false);

    const comandaData: CreateComandaRequest = {
      cliente: data.cliente,
      nome_cameriere: data.nome_cameriere,
      tavolo:
        typeof data.tavolo === "string" ? Number(data.tavolo) : data.tavolo,
      piatti: selectedItems,
      note: data.note || undefined,
    };

    try {
      await createComanda.mutateAsync(comandaData);

      // Reset form e quantità
      reset();
      setQuantities({});
      setShowItemsError(false);
    } catch (error) {
      console.error("Errore nella creazione della comanda:", error);
    }
  };

  if (menuLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Caricamento menu...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        🍽️ Nuova Comanda
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Form Dati Comanda - Semplificato */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            <Person sx={{ mr: 1, verticalAlign: "middle" }} />
            Informazioni Comanda
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Controller
              name="cliente"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Nome Cliente"
                  error={!!errors.cliente}
                  helperText={errors.cliente?.message}
                  required
                />
              )}
            />

            <Controller
              name="nome_cameriere"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.nome_cameriere}>
                  <InputLabel>Cameriere</InputLabel>
                  <Select {...field} label="Cameriere" required>
                    {CAMERIERI.map((cameriere) => (
                      <MenuItem key={cameriere} value={cameriere}>
                        {cameriere}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.nome_cameriere && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, ml: 1.5 }}
                    >
                      {errors.nome_cameriere.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="tavolo"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Numero Tavolo"
                  type="number"
                  value={value || ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue === "") {
                      onChange("");
                    } else {
                      const numValue = Number(newValue);
                      if (!isNaN(numValue) && numValue > 0) {
                        onChange(numValue);
                      }
                    }
                  }}
                  error={!!errors.tavolo}
                  helperText={errors.tavolo?.message}
                  slotProps={{
                    input: {
                      startAdornment: <TableRestaurant sx={{ mr: 1 }} />,
                    },
                    htmlInput: { min: 1 },
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
                  slotProps={{
                    input: {
                      startAdornment: <Note sx={{ mr: 1 }} />,
                    },
                  }}
                />
              )}
            />
          </Box>
        </Box>

        {/* Menu - Con Accordion */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            📋 Menu
          </Typography>

          {menuByCategory &&
            Object.entries(menuByCategory).map(([categoria, items]) => (
              <Accordion key={categoria}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: "action.hover",
                    "&:hover": { bgcolor: "action.selected" },
                  }}
                >
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {categoria}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      p: 2,
                    }}
                  >
                    {items.map((item) => (
                      <MenuItemSimple
                        key={item.id}
                        item={item}
                        quantity={quantities[item.id] ?? null}
                        onQuantityChange={(quantity) =>
                          handleQuantityChange(item.id, quantity)
                        }
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>

        {/* Riepilogo Comanda - Semplificato */}
        <Box
          sx={{
            position: { xs: "static", lg: "sticky" },
            top: 20,
            bgcolor: "background.paper",
            p: 2,
            borderRadius: 1,
            border: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" gutterBottom>
            <ShoppingCart sx={{ mr: 1, verticalAlign: "middle" }} />
            Riepilogo Comanda
          </Typography>

          {selectedItems.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              Nessun piatto selezionato
            </Typography>
          ) : (
            <>
              {selectedItems.map((item) => {
                // Trova il menu item per ottenere nome e categoria
                const menuItem = Object.values(menuByCategory || {})
                  .flat()
                  .find((m) => m.id === item.menu_id);

                if (!menuItem) return null;

                return (
                  <Box key={item.menu_id} sx={{ mb: 2 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight="medium">
                          {menuItem.nome}
                        </Typography>
                        <Chip
                          label={menuItem.categoria}
                          size="small"
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        x{item.quantita}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      €{item.prezzo_unitario.toFixed(2)} x {item.quantita} = €
                      {(item.prezzo_unitario * item.quantita).toFixed(2)}
                    </Typography>
                    <Divider sx={{ mt: 1 }} />
                  </Box>
                );
              })}

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" align="right">
                  Totale: €{totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </>
          )}

          {createComanda.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Errore nella creazione della comanda
            </Alert>
          )}

          {createComanda.isSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Comanda creata con successo!
            </Alert>
          )}

          {!isFormValid && getValidationMessage() && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {getValidationMessage()}
            </Alert>
          )}

          {showItemsError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Seleziona almeno un piatto per creare la comanda
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={createComanda.isPending}
            sx={{ mt: 2 }}
          >
            {createComanda.isPending ? "Creazione..." : "Crea Comanda"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
