"use client";

import { useAuthStore } from "@/stores/authStore";
import { ROLE_CONFIGS, UserRole } from "@/types/auth";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  selectedRole: UserRole | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  selectedRole,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const roleConfig = selectedRole ? ROLE_CONFIGS[selectedRole] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole || !roleConfig) return;

    setIsLoading(true);
    setError("");

    // Simula un piccolo delay per il login
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password === roleConfig.password) {
      login(selectedRole);
      router.push(roleConfig.redirectPath);
      onClose();
      setPassword("");
    } else {
      setError("Password non corretta");
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" component="span">
              {roleConfig?.icon} Accesso {roleConfig?.displayName}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Inserisci la password per accedere come {roleConfig?.displayName}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            disabled={isLoading}
            placeholder="Inserisci la password"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={isLoading} variant="outlined">
            Annulla
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !password.trim()}
            sx={{
              backgroundColor: roleConfig?.color,
              "&:hover": {
                backgroundColor: roleConfig?.color,
                opacity: 0.8,
              },
            }}
          >
            {isLoading ? "Accesso..." : "Accedi"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
