import React, { useState, ChangeEvent } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { toast } from 'react-toastify';
import { insertFine } from '../services/api';
import { FineDto } from '../services/api';
import { EnforcingAgency, FineStatus } from '../constants/enum';
import Layout from './Layout';

const Fines: React.FC = () => {
  const [fineData, setFineData] = useState<FineDto>({
    RegistrationDate: new Date(),
    VehicleId: 0,
    FineNumber: '',
    FineDateTime: new Date(),
    FineDueDate: new Date(),
    EnforcingAgency: EnforcingAgency.Outros,
    FineLocation: '',
    FineAmount: 0,
    DiscountedFineAmount: 0,
    FinalFineAmount: 0,
    FineStatus: FineStatus.Ativo,
    Description: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFineData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    setFineData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await insertFine(fineData);
      toast.success('Multa inserida com sucesso!');
      clearForm();
    } catch (error) {
      toast.error('Erro ao inserir multa.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFineData({
      RegistrationDate: new Date(),
      VehicleId: 0,
      FineNumber: '',
      FineDateTime: new Date(),
      FineDueDate: new Date(),
      EnforcingAgency: EnforcingAgency.Outros,
      FineLocation: '',
      FineAmount: 0,
      DiscountedFineAmount: 0,
      FinalFineAmount: 0,
      FineStatus: FineStatus.Ativo,
      Description: '',
    });
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Box mt={10} display="flex" justifyContent="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Adicionar Multa
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Número da Multa"
                name="FineNumber"
                value={fineData.FineNumber}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ID do Veículo"
                name="VehicleId"
                value={fineData.VehicleId}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data da Multa"
                name="FineDateTime"
                type="datetime-local"
                value={fineData.FineDateTime.toISOString().substring(0, 16)}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data de Vencimento"
                name="FineDueDate"
                type="datetime-local"
                value={fineData.FineDueDate.toISOString().substring(0, 16)}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Órgão Aplicador</InputLabel>
                <Select
                  name="EnforcingAgency"
                  value={fineData.EnforcingAgency}
                  onChange={handleSelectChange}
                  label="Órgão Aplicador"
                >
                  {Object.keys(EnforcingAgency)
                    .filter((key) => isNaN(Number(key)))
                    .map((key) => (
                      <MenuItem key={key} value={EnforcingAgency[key as keyof typeof EnforcingAgency]}>
                        {key}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Local da Multa"
                name="FineLocation"
                value={fineData.FineLocation}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Valor da Multa"
                name="FineAmount"
                type="number"
                value={fineData.FineAmount}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Valor com Desconto"
                name="DiscountedFineAmount"
                type="number"
                value={fineData.DiscountedFineAmount}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Valor Final"
                name="FinalFineAmount"
                type="number"
                value={fineData.FinalFineAmount}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Status da Multa</InputLabel>
                <Select
                  name="FineStatus"
                  value={fineData.FineStatus}
                  onChange={handleSelectChange}
                  label="Status da Multa"
                >
                  {Object.keys(FineStatus)
                    .filter((key) => isNaN(Number(key)))
                    .map((key) => (
                      <MenuItem key={key} value={FineStatus[key as keyof typeof FineStatus]}>
                        {key}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="Description"
                value={fineData.Description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Inserir Multa'}
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={clearForm}
                  disabled={loading}
                >
                  Limpar Campos
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Layout>
  );
};

export default Fines;
