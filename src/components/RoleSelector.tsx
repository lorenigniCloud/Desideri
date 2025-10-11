"use client";

import { ROLE_CONFIGS, UserRole } from "@/types/auth";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { LoginModal } from "./LoginModal";

export const RoleSelector: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRole(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom>
          🍽️ Ristorante Desideri
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Sistema di Gestione Ordini
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Seleziona il tuo ruolo per accedere al sistema
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {Object.values(ROLE_CONFIGS).map((config) => (
          <Grid item xs={12} sm={6} md={4} key={config.role}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 4 }}>
                <Typography
                  variant="h2"
                  component="div"
                  sx={{ fontSize: "4rem", mb: 2 }}
                >
                  {config.icon}
                </Typography>

                <Typography variant="h5" component="h2" gutterBottom>
                  {config.displayName}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {config.role === "cassiere" && "Gestisci ordini e pagamenti"}
                  {config.role === "bracerista" && "Prepara carni e grigliate"}
                  {config.role === "cuoca" && "Coordina la cucina"}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => handleRoleSelect(config.role)}
                  sx={{
                    backgroundColor: config.color,
                    py: 1.5,
                    fontSize: "1.1rem",
                    "&:hover": {
                      backgroundColor: config.color,
                      opacity: 0.8,
                    },
                  }}
                >
                  Accedi come {config.displayName}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <LoginModal
        open={modalOpen}
        onClose={handleCloseModal}
        selectedRole={selectedRole}
      />
    </Container>
  );
};
