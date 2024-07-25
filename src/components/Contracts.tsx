import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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
  SelectChangeEvent,
} from '@mui/material';
import { toast } from 'react-toastify';
import Layout from './Layout';
import { getAllVehicles, getAllClients, insertContract } from '../services/api';
import { GetVehicleDto, ClientDto, InsertContractRequestDto } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Contracts: React.FC = () => {
  const navigate = useNavigate();
  const company = JSON.parse(localStorage.getItem('company') || '{}');
  const serviceProviderCompanyId = company.id;
  const [vehicles, setVehicles] = useState<GetVehicleDto[]>([]);
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<InsertContractRequestDto>({
    ServiceProviderCompanyId: serviceProviderCompanyId,
    ClientCompanyId: 0,
    StartDate: '',
    EndDate: '',
    Status: '',
    VehicleIds: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehicleResponse, clientResponse] = await Promise.all([getAllVehicles(), getAllClients()]);
        setVehicles(vehicleResponse);
        setClients(clientResponse);
      } catch (error) {
        toast.error('Erro ao carregar veículos e clientes.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | number>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name as string]: value,
    }));
  };

  const handleVehicleChange = (event: SelectChangeEvent<number[]>) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      VehicleIds: value as number[],
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await insertContract(formData);
      toast.success('Contrato inserido com sucesso!');
      setFormData({
        ServiceProviderCompanyId: serviceProviderCompanyId,
        ClientCompanyId: 0,
        StartDate: '',
        EndDate: '',
        Status: '',
        VehicleIds: [],
      });
    } catch (error) {
      toast.error('Erro ao inserir contrato.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Box mt={10} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Inserir Contrato
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Cliente</InputLabel>
                  <Select
                    name="ClientCompanyId"
                    value={formData.ClientCompanyId}
                    onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
                    label="Cliente"
                  >
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Início"
                  name="StartDate"
                  type="date"
                  value={formData.StartDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Término"
                  name="EndDate"
                  type="date"
                  value={formData.EndDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="Status"
                    value={formData.Status}
                    onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
                    label="Status"
                  >
                    <MenuItem value="Ativo">Ativo</MenuItem>
                    <MenuItem value="Inativo">Inativo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Veículos</InputLabel>
                  <Select
                    name="VehicleIds"
                    multiple
                    value={formData.VehicleIds}
                    onChange={handleVehicleChange}
                    label="Veículos"
                  >
                    {vehicles.map((vehicle) => (
                      <MenuItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.modelName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" gap={2}>
                  <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Inserir Contrato'}
                  </Button>
                  <Button type="button" variant="contained" color="secondary" onClick={() => navigate('/contracts')} disabled={loading}>
                    Cancelar
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

export default Contracts;
