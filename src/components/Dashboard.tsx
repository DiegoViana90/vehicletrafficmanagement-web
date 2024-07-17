import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';

const Dashboard: React.FC = () => {
  const companyName = localStorage.getItem('companyName');

  return (
    <Container maxWidth="lg" style={{ marginTop: '64px', marginLeft: '240px' }}>
      <Typography variant="h2" gutterBottom>
        Bem-vindo à {companyName || 'Sua Empresa'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper>Valor a receber hoje: R$ 0,00</Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper>Valor vencido há 2d: R$ 0,00</Paper>
        </Grid>
        {/* Adicione outros componentes conforme necessário */}
      </Grid>
    </Container>
  );
};

export default Dashboard;
