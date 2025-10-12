"use client";

import { ROLE_CONFIGS, UserRole } from "@/types/auth";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" color="text.primary" gutterBottom>
          Sistema di Gestione Ordini
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Seleziona il tuo ruolo per accedere al sistema
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          alignItems: "center",
          maxWidth: 400,
          mx: "auto",
        }}
      >
        {Object.values(ROLE_CONFIGS).map((config) => (
          <Box key={config.role} sx={{ width: "100%", maxWidth: 250 }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: "50%",
                aspectRatio: "1",
                transition: "transform 0.2s, box-shadow 0.2s",
                backgroundColor: config.color,
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
                cursor: "pointer",
              }}
              onClick={() => handleRoleSelect(config.role)}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  textAlign: "center",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h2"
                  component="div"
                  sx={{
                    fontSize: "3rem",
                    mb: 1,
                    color: "white",
                  }}
                >
                  {config.icon}
                </Typography>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {config.displayName}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <LoginModal
        open={modalOpen}
        onClose={handleCloseModal}
        selectedRole={selectedRole}
      />
    </Container>
  );
};
