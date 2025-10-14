"use client";

import { CAMERIERI } from "@/lib/supabase";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import React from "react";

interface WaiterFilterProps {
  selectedCameriere: string;
  onCameriereChange: (cameriere: string) => void;
  title?: string;
  showTitle?: boolean;
}

export const WaiterFilter: React.FC<WaiterFilterProps> = ({
  selectedCameriere,
  onCameriereChange,
  title = "🔍 Filtro Comande",
  showTitle = true,
}) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {showTitle && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <FormControl fullWidth>
        <InputLabel>Cameriere</InputLabel>
        <Select
          value={selectedCameriere}
          onChange={(e) => onCameriereChange(e.target.value)}
          label="Cameriere"
        >
          <MenuItem value="">
            <em>Tutti i camerieri</em>
          </MenuItem>
          {CAMERIERI.map((cameriere) => (
            <MenuItem key={cameriere} value={cameriere}>
              {cameriere}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedCameriere && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Visualizzando comande per: <strong>{selectedCameriere}</strong>
        </Typography>
      )}
    </Paper>
  );
};
