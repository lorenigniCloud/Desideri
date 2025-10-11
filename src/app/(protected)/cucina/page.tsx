import { DepartmentLayout } from "@/components/DepartmentLayout";
import { PermissionWrapper } from "@/components/PermissionWrapper";
import { Box, Button, Paper, Typography } from "@mui/material";

export default function CucinaPage() {
  return (
    <DepartmentLayout
      department="cuoca"
      title="Cucina"
      icon="👩‍🍳"
      description="Coordinamento della cucina"
    >
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Benvenuto nella sezione Cucina!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Qui potrai coordinare tutte le attività della cucina.
        </Typography>

        {/* Esempio di pulsanti con controllo permessi */}
        <Box mt={3} display="flex" gap={2} justifyContent="center">
          <PermissionWrapper requiredRole="cuoca" requireEdit={false}>
            <Button variant="outlined" color="primary">
              Visualizza Ordini Cucina
            </Button>
          </PermissionWrapper>

          <PermissionWrapper
            requiredRole="cuoca"
            requireEdit={true}
            fallback={
              <Button variant="outlined" disabled>
                Coordina Cucina (Solo Cuoca)
              </Button>
            }
          >
            <Button variant="contained" color="primary">
              Coordina Cucina
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
