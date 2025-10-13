"use client";

import { Menu } from "@/lib/supabase";
import { Close, Info } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { QuantityInput } from "./QuantityInput";

interface MenuItemSimpleProps {
  item: Menu;
  quantity: number | null;
  onQuantityChange: (quantity: number | null) => void;
}

export const MenuItemSimple: React.FC<MenuItemSimpleProps> = ({
  item,
  quantity,
  onQuantityChange,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: (quantity ?? 0) > 0 ? "action.selected" : "background.paper",
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: "action.hover",
          },
          minHeight: 60, // Altezza minima per evitare overflow
          overflow: "hidden", // Previene overflow
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" fontWeight="medium">
              {item.nome}
            </Typography>

            <IconButton size="small" sx={{ p: 0.5 }} onClick={handleInfoClick}>
              <Info fontSize="small" color="action" />
            </IconButton>
          </Box>

          {showInfo && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 1000,
                mt: 1,
                p: 2,
                bgcolor: "primary.main",
                color: "white",
                borderRadius: 2,
                boxShadow: 3,
                border: 1,
                borderColor: "primary.dark",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Informazioni Piatto
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowInfo(false)}
                  sx={{
                    color: "white",
                    p: 0.5,
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ color: "white", mb: 1 }}>
                <strong>Descrizione:</strong>{" "}
                {item.descrizione || "Nessuna descrizione"}
              </Typography>
              <Typography variant="body2" sx={{ color: "white" }}>
                <strong>Prezzo:</strong> €{item.prezzo.toFixed(2)}
              </Typography>
            </Box>
          )}
        </Box>

        <QuantityInput
          value={quantity}
          onChange={onQuantityChange}
          min={0}
          max={99}
        />
      </Box>
    </Box>
  );
};
