"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { Navbar } from "@/components/Navbar";
import { Box, Container, Paper, Typography } from "@mui/material";

export default function BracePage() {
  return (
    <AuthGuard requiredRole="bracerista">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h3" component="h1" gutterBottom>
              🍖 Brace
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Preparazione carni e grigliate
            </Typography>
          </Box>

          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              Benvenuto nella sezione Brace!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Qui potrai gestire la preparazione delle carni e delle grigliate.
            </Typography>
            <Box mt={3}>
              <Typography variant="body2" color="text.secondary">
                🔧 Funzionalità in sviluppo...
              </Typography>
            </Box>
          </Paper>
        </Container>
      </div>
    </AuthGuard>
  );
}
