"use client";

import { Add, Remove } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import React from "react";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
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
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Permetti campo vuoto per digitazione
    if (inputValue === "") {
      onChange(0);
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
        disabled={disabled || value <= min}
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
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        type="number"
        size="small"
        sx={{
          width: 60,
          "& .MuiInputBase-input": {
            textAlign: "center",
            padding: "8px",
          },
        }}
        slotProps={{
          htmlInput: {
            min,
            max,
            style: { textAlign: "center" },
          },
        }}
      />

      <IconButton
        onClick={handleIncrement}
        disabled={disabled || value >= max}
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
