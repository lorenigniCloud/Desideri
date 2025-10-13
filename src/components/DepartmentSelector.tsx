"use client";

import { ROLE_CONFIGS, UserRole } from "@/types/auth";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

export const DepartmentSelector: React.FC = () => {
  const router = useRouter();

  const handleDepartmentSelect = (department: UserRole) => {
    const config = ROLE_CONFIGS[department];
    // Scroll automatico in cima alla pagina
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(config.redirectPath);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" component="h2" gutterBottom>
          Seleziona Reparto
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Scegli il reparto da visualizzare
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 4,
          justifyItems: "center",
        }}
      >
        {Object.values(ROLE_CONFIGS).map((config) => (
          <Box key={config.role} sx={{ width: "100%", maxWidth: 400 }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={() => handleDepartmentSelect(config.role)}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 4 }}>
                <Typography
                  variant="h2"
                  component="div"
                  sx={{ fontSize: "4rem", mb: 2 }}
                >
                  {config.departmentIcon}
                </Typography>

                <Typography variant="h5" component="h2" gutterBottom>
                  {config.department}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {config.role === "cassiere" && "Gestisci ordini e pagamenti"}
                  {config.role === "bracerista" && "Prepara carni e grigliate"}
                  {config.role === "cuoca" && "Coordina la cucina"}
                  {config.role === "cameriere" && "Visualizza le tue comande"}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};
