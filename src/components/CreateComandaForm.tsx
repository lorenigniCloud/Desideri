"use client";

import { MenuItemCard } from "@/components/MenuItemCard";
import { useCreateComanda } from "@/hooks/useComande";
import { useMenuByCategory } from "@/hooks/useMenu";
import { CreateComandaRequest, PiattoComanda } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FilterList,
  Note,
  Person,
  ShoppingCart,
  TableRestaurant,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Schema di validazione Zod
const comandaSchema = z.object({
  cliente: z.string().min(1, "Nome cliente è obbligatorio").trim(),
  nome_cameriere: z.string().min(1, "Nome cameriere è obbligatorio").trim(),
  tavolo: z.number().min(1, "Il numero tavolo deve essere almeno 1"),
  note: z.string().optional(),
});

type ComandaFormData = z.infer<typeof comandaSchema>;

export const CreateComandaForm: React.FC = () => {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: menuByCategory, isLoading: menuLoading } = useMenuByCategory();
  const createComanda = useCreateComanda();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
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
  const handleQuantityChange = (itemId: number, quantity: number) => {
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
        const quantity = quantities[item.id] || 0;
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

  // Filtro per categoria
  const filteredMenu = useMemo(() => {
    if (!menuByCategory) return {};
    if (selectedCategory === "all") return menuByCategory;

    return {
      [selectedCategory]: menuByCategory[selectedCategory] || [],
    };
  }, [menuByCategory, selectedCategory]);

  // Categorie disponibili
  const availableCategories = useMemo(() => {
    if (!menuByCategory) return [];
    return Object.keys(menuByCategory);
  }, [menuByCategory]);

  const onSubmit = async (data: ComandaFormData) => {
    if (selectedItems.length === 0) {
      return;
    }

    const comandaData: CreateComandaRequest = {
      cliente: data.cliente,
      nome_cameriere: data.nome_cameriere,
      tavolo: data.tavolo,
      piatti: selectedItems,
      note: data.note || undefined,
    };

    try {
      await createComanda.mutateAsync(comandaData);

      // Reset form e quantità
      reset();
      setQuantities({});
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
    <Box sx={{ maxWidth: 1400, mx: "auto", p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        🍽️ Nuova Comanda
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 3,
          }}
        >
          {/* Form Dati Comanda */}
          <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
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
                    <TextField
                      {...field}
                      fullWidth
                      label="Nome Cameriere"
                      error={!!errors.nome_cameriere}
                      helperText={errors.nome_cameriere?.message}
                      required
                    />
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
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
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
            </Paper>

            {/* Menu */}
            <Paper sx={{ p: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
                flexWrap="wrap"
                gap={2}
              >
                <Typography variant="h6">📋 Menu</Typography>
                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                  <FilterList />
                  <ToggleButtonGroup
                    value={selectedCategory}
                    exclusive
                    onChange={(_, newCategory) =>
                      newCategory && setSelectedCategory(newCategory)
                    }
                    size="small"
                  >
                    <ToggleButton value="all">Tutti</ToggleButton>
                    {availableCategories.map((category) => (
                      <ToggleButton key={category} value={category}>
                        {category}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              </Box>

              {Object.entries(filteredMenu).map(([categoria, items]) => (
                <Box key={categoria} mb={4}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    {categoria} ({items.length} piatti)
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                      },
                      gap: 3,
                    }}
                  >
                    {items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        quantity={quantities[item.id] || 0}
                        onQuantityChange={handleQuantityChange}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Paper>
          </Box>

          {/* Riepilogo Comanda */}
          <Box>
            <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
              <Typography variant="h6" gutterBottom>
                <ShoppingCart sx={{ mr: 1, verticalAlign: "middle" }} />
                Riepilogo Comanda
              </Typography>

              {selectedItems.length === 0 ? (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4 }}
                >
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
                          €{item.prezzo_unitario.toFixed(2)} x {item.quantita} =
                          €{(item.prezzo_unitario * item.quantita).toFixed(2)}
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

              {selectedItems.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Seleziona almeno un piatto per creare la comanda
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={
                  !isValid ||
                  selectedItems.length === 0 ||
                  createComanda.isPending
                }
                sx={{ mt: 2 }}
              >
                {createComanda.isPending ? "Creazione..." : "Crea Comanda"}
              </Button>
            </Paper>
          </Box>
        </Box>
      </form>
    </Box>
  );
};
