// src/components/UpdateFine.tsx
import React, { useState, ChangeEvent, useEffect } from 'react';
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
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
} from '@mui/material';
import { toast } from 'react-toastify';
import { updateFine, FineDto } from '../services/api';
import { EnforcingAgency, FineStatus } from '../constants/enum';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const UpdateFine: React.FC = () => {
  const navigate = useNavigate();
  const fineDataFromStore = useSelector((state: RootState) => state.fine.data); // Accessing fine data from Redux
  const [fineData, setFineData] = useState<FineDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (fineDataFromStore) {
      setFineData({
        ...fineDataFromStore,
        FineDateTime: fineDataFromStore.FineDateTime || '',
        FineDueDate: fineDataFromStore.FineDueDate || '',
        LicensePlate: fineDataFromStore.LicensePlate || ''
      });
    } else {
      navigate('/fines');
    }
  }, [fineDataFromStore, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fineData) return;
    setLoading(true);
    try {
      await updateFine(fineData);
      toast.success('Multa atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar multa.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFineData((prevData) => (prevData ? {
      ...prevData,
      [name]: value,
    } : null));
  };

  const handleSelectChange = (event: SelectChangeEvent<EnforcingAgency | FineStatus>) => {
    const { name, value } = event.target;
    setFineData((prevData) => (prevData ? {
      ...prevData,
      [name]: value,
    } : null));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Layout>
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
          fineData && (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Número da Multa"
                    name="FineNumber"
                    value={fineData.FineNumber}
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
                    value={fineData.LicensePlate}
                    variant="outlined"
                    onChange={handleChange}
                    required
                  />
                </Grid>
                {isEditing ? (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Data da Multa"
                        name="FineDateTime"
                        type="datetime-local"
                        value={fineData.FineDateTime}
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
                        type="date"
                        value={fineData.FineDueDate}
                        onChange={handleChange}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Data da Multa"
                        name="FineDateTime"
                        value={fineData.FineDateTime}
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                        }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Data de Vencimento"
                        name="FineDueDate"
                        value={fineData.FineDueDate}
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                        }}
                        required
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>Órgão Autuador</InputLabel>
                    <Select
                      name="EnforcingAgency"
                      value={fineData.EnforcingAgency}
                      onChange={handleSelectChange}
                      label="Órgão Autuador"
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
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Valor da Multa"
                    name="FineAmount"
                    type="number"
                    value={fineData.FineAmount}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: <Box component="span">R$</Box>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Valor de Desconto"
                    name="DiscountedFineAmount"
                    type="number"
                    value={fineData.DiscountedFineAmount || ''}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Box component="span">R$</Box>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Valor com Juros"
                    name="InterestFineAmount"
                    type="number"
                    value={fineData.InterestFineAmount || ''}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Box component="span">R$</Box>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Valor Final"
                    name="FinalFineAmount"
                    type="number"
                    value={fineData.FinalFineAmount}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: <Box component="span">R$</Box>,
                    }}
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
                          <MenuItem
                            key={key}
                            value={FineStatus[key as keyof typeof FineStatus]}
                          >
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
                    {!isEditing && (
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        onClick={handleEdit}
                      >
                        Editar Multa
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </form>
          )
        )}
      </Container>
    </Layout>
  );
};

export default UpdateFine;
