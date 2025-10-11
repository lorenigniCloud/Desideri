import { DepartmentLayout } from "@/components/DepartmentLayout";
import { PermissionWrapper } from "@/components/PermissionWrapper";
import { Box, Button, Paper, Typography } from "@mui/material";

export default function CassaPage() {
  return (
    <DepartmentLayout
      department="cassiere"
      title="Cassa"
      icon="💰"
      description="Gestione ordini e pagamenti"
    >
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Benvenuto nella sezione Cassa!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Qui potrai gestire gli ordini e i pagamenti dei clienti.
        </Typography>

        {/* Esempio di pulsanti con controllo permessi */}
        <Box mt={3} display="flex" gap={2} justifyContent="center">
          <PermissionWrapper requiredRole="cassiere" requireEdit={false}>
            <Button variant="outlined" color="primary">
              Visualizza Ordini
            </Button>
          </PermissionWrapper>

          <PermissionWrapper
            requiredRole="cassiere"
            requireEdit={true}
            fallback={
              <Button variant="outlined" disabled>
                Gestisci Pagamenti (Solo Cassiere)
              </Button>
            }
          >
            <Button variant="contained" color="primary">
              Gestisci Pagamenti
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
