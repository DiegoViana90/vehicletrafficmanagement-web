import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent
} from '@mui/material';
import { toast } from 'react-toastify';
import { updateFine, FineDto } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { EnforcingAgency, FineStatus } from '../constants/enum';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';

const UpdateFine: React.FC = () => {
  const navigate = useNavigate();
  const fineDataFromStore = useSelector((state: RootState) => state.fine.data);
  const [fineData, setFineData] = useState<FineDto | null>(fineDataFromStore);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (!fineDataFromStore) {
      navigate('/fines');
    } else {
      setFineData(fineDataFromStore);
    }
  }, [fineDataFromStore, navigate]);

  const validateForm = () => {
    const isValid =
      fineData?.FineNumber?.trim() !== '' &&
      fineData?.FineDueDate &&
      fineData?.EnforcingAgency !== EnforcingAgency.Outros &&
      fineData?.FineLocation?.trim() !== '' &&
      fineData?.FineAmount !== undefined &&
      fineData?.FinalFineAmount !== undefined &&
      fineData?.FineAmount > 0 &&
      fineData?.FinalFineAmount >= 0;
    setIsFormValid(isValid || false);
  };

  useEffect(() => {
    validateForm();
  }, [fineData]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFineData((prevData) => ({
      ...prevData,
      [name]: value,
    }) as FineDto);
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFineData((prevData) => ({
      ...prevData,
      [name]: parseInt(value, 10),
    }) as FineDto);
  };

  const formatDate = (date: Date | string | undefined, type: 'datetime-local' | 'date') => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return ''; // Verifica se a data é válida
    return type === 'datetime-local'
      ? d.toISOString().slice(0, -8)
      : d.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateFine(fineData as FineDto);
      toast.success('Multa atualizada com sucesso!');
      navigate('/fines');
    } catch (error) {
      toast.error('Erro ao atualizar multa.');
    } finally {
      setLoading(false);
    }
  };

  if (!fineData) {
    return (
      <Layout>
        <Sidebar />
        <Container maxWidth="md">
          <Box mt={10} display="flex" justifyContent="center">
            <Typography variant="h6" component="div">
              Carregando dados da multa...
            </Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Sidebar />
      <Container maxWidth="md">
        <Box mt={10} display="flex" justifyContent="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Atualizar Multa
          </Typography>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <CircularProgress />
            <Typography variant="h6" component="div" ml={2}>
              Carregando...
            </Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Número da Multa"
                  name="FineNumber"
                  value={fineData.FineNumber || ''}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Placa do Veículo"
                  name="LicensePlate"
                  value={fineData.LicensePlate || ''}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Data da Multa"
                  name="FineDateTime"
                  type="datetime-local"
                  value={formatDate(fineData.FineDateTime, 'datetime-local')}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Data de Vencimento"
                  name="FineDueDate"
                  type="date"
                  value={formatDate(fineData.FineDueDate, 'date')}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Órgão Autuador</InputLabel>
                  <Select
                    name="EnforcingAgency"
                    value={fineData.EnforcingAgency?.toString() || ''}
                    onChange={handleSelectChange}
                    label="Órgão Autuador"
                  >
                    {Object.keys(EnforcingAgency)
                      .filter((key) => isNaN(Number(key)))
                      .map((key) => (
                        <MenuItem key={key} value={EnforcingAgency[key as keyof typeof EnforcingAgency].toString()}>
                          {key}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Local da Multa"
                  name="FineLocation"
                  value={fineData.FineLocation || ''}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Valor da Multa"
                  name="FineAmount"
                  type="number"
                  value={fineData.FineAmount?.toString() || ''}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Valor de Desconto"
                  name="DiscountedFineAmount"
                  type="number"
                  value={fineData.DiscountedFineAmount?.toString() || ''}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Valor com Juros"
                  name="InterestFineAmount"
                  type="number"
                  value={fineData.InterestFineAmount?.toString() || ''}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Valor Final"
                  name="FinalFineAmount"
                  type="number"
                  value={fineData.FinalFineAmount?.toString() || ''}
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
                    value={fineData.FineStatus?.toString() || ''}
                    onChange={handleSelectChange}
                    label="Status da Multa"
                  >
                    {Object.keys(FineStatus)
                      .filter((key) => isNaN(Number(key)))
                      .map((key) => (
                        <MenuItem key={key} value={FineStatus[key as keyof typeof FineStatus].toString()}>
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
                  value={fineData.Description || ''}
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
                    disabled={loading || !isFormValid}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Atualizar Multa'}
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/fines')}
                    disabled={loading}
                  >
                    Voltar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Container>
    </Layout>
  );
};

export default UpdateFine;
