import { DepartmentLayout } from "@/components/DepartmentLayout";
import { PermissionWrapper } from "@/components/PermissionWrapper";
import { Box, Button, Paper, Typography } from "@mui/material";

export default function BracePage() {
  return (
    <DepartmentLayout
      department="bracerista"
      title="Brace"
      icon="🍖"
      description="Preparazione carni e grigliate"
    >
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Benvenuto nella sezione Brace!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Qui potrai gestire la preparazione delle carni e delle grigliate.
        </Typography>

        {/* Esempio di pulsante con controllo permessi */}
        <Box mt={3} display="flex" gap={2} justifyContent="center">
          <PermissionWrapper requiredRole="bracerista" requireEdit={false}>
            <Button variant="outlined" color="primary">
              Visualizza Ordini Brace
            </Button>
          </PermissionWrapper>

          <PermissionWrapper
            requiredRole="bracerista"
            requireEdit={true}
            fallback={
              <Button variant="outlined" disabled>
                Modifica Ordini (Solo Bracerista)
              </Button>
            }
          >
            <Button variant="contained" color="primary">
              Modifica Ordini Brace
            </Button>
          </PermissionWrapper>
        </Box>

        <Box mt={3}>
          <Typography variant="body2" color="text.secondary">
            🔧 Funzionalità in sviluppo...
          </Typography>
        </Box>
      </Paper>
    </DepartmentLayout>
  );
}
