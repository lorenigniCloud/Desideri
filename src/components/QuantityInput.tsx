"use client";

import { Add, Remove } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import React from "react";

interface QuantityInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 99,
  disabled = false,
}) => {
  const handleIncrement = () => {
    const currentValue = value ?? 0;
    if (currentValue < max) {
      onChange(currentValue + 1);
    }
  };

  const handleDecrement = () => {
    const currentValue = value ?? 0;
    if (currentValue > min) {
      onChange(currentValue - 1);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Permetti campo vuoto per digitazione
    if (inputValue === "") {
      onChange(null);
      return;
    }

    const newValue = parseInt(inputValue);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexShrink: 0, // Previene il restringimento
        minWidth: "fit-content", // Larghezza minima per contenere tutto
      }}
    >
      <IconButton
        onClick={handleDecrement}
        disabled={disabled || (value ?? 0) <= min}
        size="small"
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          minWidth: 32,
          height: 32,
        }}
      >
        <Remove fontSize="small" />
      </IconButton>

      <TextField
        value={value ?? ""}
        onChange={handleInputChange}
        disabled={disabled}
        type="number"
        size="small"
        sx={{
          width: 60,
          "& .MuiInputBase-input": {
            textAlign: "center",
            padding: "8px",
            // Rimuove le frecce di incremento/decremento
            "&::-webkit-outer-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
            "&::-webkit-inner-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
          },
        }}
        slotProps={{
          htmlInput: {
            min,
            max,
            style: {
              textAlign: "center",
              MozAppearance: "textfield", // Firefox
            },
          },
        }}
      />

      <IconButton
        onClick={handleIncrement}
        disabled={disabled || (value ?? 0) >= max}
        size="small"
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          minWidth: 32,
          height: 32,
        }}
      >
        <Add fontSize="small" />
      </IconButton>
    </Box>
  );
};
