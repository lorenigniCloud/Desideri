"use client";

import { useAuthStore } from "@/stores/authStore";
import { ROLE_CONFIGS } from "@/types/auth";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { AppBar, Box, Button, Chip, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

export const Navbar: React.FC = () => {
  const { isAuthenticated, role, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated || !role) {
    return null;
  }

  const roleConfig = ROLE_CONFIGS[role];

  return (
    <AppBar position="static" sx={{ backgroundColor: roleConfig.color }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          🍽️ Ristorante Desideri
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            icon={<span>{roleConfig.icon}</span>}
            label={roleConfig.displayName}
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              "& .MuiChip-icon": { color: "white" },
            }}
          />

          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
