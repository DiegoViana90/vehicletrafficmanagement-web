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
} from '@mui/material';
import { toast } from 'react-toastify';
import { updateFine, getFineByFineNumberAndVehicleId, FineDto } from '../services/api';
import { EnforcingAgency, FineStatus } from '../constants/enum';
import { format, isBefore, startOfDay } from 'date-fns';
import Layout from './Layout';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateFine: React.FC = () => {
  const navigate = useNavigate();
  const { fineNumber } = useParams<{ fineNumber?: string }>(); // Ajustado para aceitar opcional
  const [fineData, setFineData] = useState<FineDto | null>({
    RegistrationDate: new Date(),
    VehicleId: 0,
    FineNumber: '',
    LicensePlate: '',
    FineDateTime: new Date(),
    FineDueDate: new Date(),
    EnforcingAgency: EnforcingAgency.Outros,
    FineLocation: '',
    FineAmount: 0,
    DiscountedFineAmount: 0,
    InterestFineAmount: 0,
    FinalFineAmount: 0,
    FineStatus: FineStatus.Ativo,
    Description: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFineData = async () => {
      if (fineNumber) {
        setLoading(true);
        try {
          const fine = await getFineByFineNumberAndVehicleId(fineNumber, 0);
          if (fine) {
            setFineData(fine);
          } else {
            toast.error('Multa não encontrada.');
            navigate('/'); // Redireciona se a multa não for encontrada
          }
        } catch (error) {
          toast.error('Erro ao buscar multa.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFineData();
  }, [fineNumber, navigate]);

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

  const formatToLocalDateTime = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  const formatToDateOnly = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    return format(date, "yyyy-MM-dd");
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Data da Multa"
                    name="FineDateTime"
                    type="datetime-local"
                    value={formatToLocalDateTime(new Date(fineData.FineDateTime))}
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
                    value={formatToDateOnly(new Date(fineData.FineDueDate))}
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
                    <InputLabel>Órgão Autuador</InputLabel>
                    <Select
                      name="EnforcingAgency"
                      value={fineData.EnforcingAgency}
                      onChange={(event) =>
                        setFineData((prevData) => (prevData ? {
                          ...prevData,
                          EnforcingAgency: event.target.value as EnforcingAgency,
                        } : null))
                      }
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
                      onChange={(event) =>
                        setFineData((prevData) => (prevData ? {
                          ...prevData,
                          FineStatus: event.target.value as FineStatus,
                        } : null))
                      }
                      label="Status da Multa"
                    >
                      {Object.keys(FineStatus)
                        .filter((key) => isNaN(Number(key)))
                        .map((key) => (
                          <MenuItem
                            key={key}
                            value={FineStatus[key as keyof typeof FineStatus]}
                            disabled={FineStatus[key as keyof typeof FineStatus] === FineStatus.Ativo && isBefore(new Date(fineData.FineDueDate), startOfDay(new Date()))}
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
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                      {loading ? <CircularProgress size={24} /> : 'Atualizar Multa'}
                    </Button>
                    <Button type="button" variant="contained" color="secondary" onClick={() => navigate('/fines')} disabled={loading}>
                      Voltar
                    </Button>
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
