"use client";

import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Slider,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

interface MenuItemCardProps {
  item: {
    id: number;
    nome: string;
    categoria: string;
    prezzo: number;
    descrizione?: string;
    disponibile: boolean;
  };
  quantity: number;
  onQuantityChange: (itemId: number, quantity: number) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  quantity,
  onQuantityChange,
}) => {
  const [localQuantity, setLocalQuantity] = useState(quantity);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setLocalQuantity(value);
    onQuantityChange(item.id, value);
  };

  const handleIncrement = () => {
    const newValue = Math.min(localQuantity + 1, 10);
    setLocalQuantity(newValue);
    onQuantityChange(item.id, newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(localQuantity - 1, 0);
    setLocalQuantity(newValue);
    onQuantityChange(item.id, newValue);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        opacity: !item.disponibile ? 0.6 : 1,
        border: localQuantity > 0 ? 2 : 1,
        borderColor: localQuantity > 0 ? "primary.main" : "divider",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="start"
          mb={1}
        >
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
            {item.nome}
          </Typography>
          <Chip
            label={item.categoria}
            size="small"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        </Box>

        {item.descrizione && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, minHeight: 40 }}
          >
            {item.descrizione}
          </Typography>
        )}

        <Typography
          variant="h6"
          color="primary"
          sx={{ mb: 2, fontWeight: 700 }}
        >
          €{item.prezzo.toFixed(2)}
        </Typography>

        {item.disponibile && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Quantità: {localQuantity}
            </Typography>

            <Box sx={{ px: 1, mb: 2 }}>
              <Slider
                value={localQuantity}
                onChange={handleSliderChange}
                min={0}
                max={10}
                step={1}
                marks={[
                  { value: 0, label: "0" },
                  { value: 5, label: "5" },
                  { value: 10, label: "10" },
                ]}
                valueLabelDisplay="auto"
                size="small"
              />
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <IconButton
                onClick={handleDecrement}
                disabled={localQuantity === 0}
                color="primary"
                size="small"
              >
                <Remove />
              </IconButton>

              <Typography
                variant="h6"
                sx={{ mx: 2, minWidth: 20, textAlign: "center" }}
              >
                {localQuantity}
              </Typography>

              <IconButton
                onClick={handleIncrement}
                disabled={localQuantity >= 10}
                color="primary"
                size="small"
              >
                <Add />
              </IconButton>
            </Box>

            {localQuantity > 0 && (
              <Typography
                variant="body2"
                color="primary"
                align="center"
                sx={{ mt: 1, fontWeight: 600 }}
              >
                Subtotale: €{(item.prezzo * localQuantity).toFixed(2)}
              </Typography>
            )}
          </Box>
        )}

        {!item.disponibile && (
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Chip label="Non Disponibile" color="error" size="small" />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
