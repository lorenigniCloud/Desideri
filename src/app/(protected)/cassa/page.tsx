"use client";

import { CreateComandaForm } from "@/components/CreateComandaForm";
import { DepartmentLayout } from "@/components/DepartmentLayout";
import { PermissionWrapper } from "@/components/PermissionWrapper";
import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

function CassaContent() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="📝 Nuova Comanda" />
          <Tab label="📋 Ordini Attivi" />
          <Tab label="💰 Pagamenti" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <PermissionWrapper
          requiredRole="cassiere"
          requireEdit={true}
          fallback={
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="error">
                ⚠️ Solo i cassieri possono creare nuove comande
              </Typography>
            </Paper>
          }
        >
          <CreateComandaForm />
        </PermissionWrapper>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            📋 Ordini Attivi
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Lista degli ordini in corso...
          </Typography>
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              🔧 Funzionalità in sviluppo...
            </Typography>
          </Box>
        </Paper>
      )}

      {tabValue === 2 && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            💰 Gestione Pagamenti
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sistema di pagamento e fatturazione...
          </Typography>
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              🔧 Funzionalità in sviluppo...
            </Typography>
          </Box>
        </Paper>
      )}
    </>
  );
}

export default function CassaPage() {
  return (
    <DepartmentLayout
      department="cassiere"
      title="Cassa"
      icon="💰"
      description="Gestione ordini e pagamenti"
    >
      <CassaContent />
    </DepartmentLayout>
  );
}
