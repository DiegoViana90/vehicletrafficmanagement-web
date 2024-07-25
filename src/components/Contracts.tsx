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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  IconButton,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { toast } from 'react-toastify';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import Layout from './Layout';
import { getAllVehicles, getAllCompanies, insertContract } from '../services/api';
import { GetVehicleDto, ClientDto, InsertContractRequestDto } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { VehicleManufacturers } from '../constants/enum';

const Contracts: React.FC = () => {
  const navigate = useNavigate();
  const company = JSON.parse(localStorage.getItem('company') || '{}');
  const serviceProviderCompanyId = company.id;
  const [vehicles, setVehicles] = useState<GetVehicleDto[]>([]);
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<GetVehicleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<InsertContractRequestDto>({
    ServiceProviderCompanyId: serviceProviderCompanyId,
    ClientCompanyId: 0, // Initializing with 0 instead of undefined
    StartDate: '',
    EndDate: '',
    Status: '',
    VehicleIds: [],
  });
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehicleResponse, clientResponse] = await Promise.all([getAllVehicles(), getAllCompanies()]);
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
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await insertContract({ ...formData, VehicleIds: selectedVehicles.map(vehicle => vehicle.id) });
      toast.success('Contrato inserido com sucesso!');
      setFormData({
        ServiceProviderCompanyId: serviceProviderCompanyId,
        ClientCompanyId: 0,
        StartDate: '',
        EndDate: '',
        Status: '',
        VehicleIds: [],
      });
      setSelectedVehicles([]);
    } catch (error) {
      toast.error('Erro ao inserir contrato.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectVehicle = (vehicle: GetVehicleDto) => {
    setSelectedVehicles((prevSelected) => [...prevSelected, vehicle]);
    setVehicles((prevVehicles) => prevVehicles.filter(v => v.id !== vehicle.id));
  };

  const handleRemoveVehicle = (vehicleId: number) => {
    const vehicleToRemove = selectedVehicles.find(vehicle => vehicle.id === vehicleId);
    if (vehicleToRemove) {
      setSelectedVehicles((prevSelected) => prevSelected.filter(vehicle => vehicle.id !== vehicleId));
      setVehicles((prevVehicles) => [...prevVehicles, vehicleToRemove]);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.licensePlate.includes(searchQuery.toUpperCase()) || vehicle.chassis.includes(searchQuery.toUpperCase())
  );

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
                    value={formData.ClientCompanyId || ''}
                    onChange={(e) => handleChange(e as SelectChangeEvent<number>)}
                    label="Cliente"
                  >
                    <MenuItem value={0} disabled>
                      Selecione um Cliente
                    </MenuItem>
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
                    value={formData.Status || ''}
                    onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
                    label="Status"
                  >
                    <MenuItem value="Ativo">Ativo</MenuItem>
                    <MenuItem value="Inativo">Inativo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" alignItems="center" height="100%">
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                  >
                    Selecionar Veículos
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                {selectedVehicles.map(vehicle => (
                  <Box key={vehicle.id} display="flex" alignItems="center" justifyContent="space-between" p={1} my={1} border={1}>
                    <Typography>
                      {vehicle.modelName} | {VehicleManufacturers[vehicle.manufacturer]} | {vehicle.observations} | {vehicle.licensePlate} | {vehicle.chassis} | {vehicle.manufactureYear} | {vehicle.modelYear}
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={() => handleRemoveVehicle(vehicle.id)}>
                      Remover
                    </Button>
                  </Box>
                ))}
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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Selecionar Veículos
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Buscar por Placa ou Chassi"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Modelo</TableCell>
                  <TableCell>Montadora</TableCell>
                  <TableCell>Observações</TableCell>
                  <TableCell>Placa</TableCell>
                  <TableCell>Chassi</TableCell>
                  <TableCell>Ano Fabricação</TableCell>
                  <TableCell>Ano Modelo</TableCell>
                  <TableCell>Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>{vehicle.modelName}</TableCell>
                    <TableCell>{VehicleManufacturers[vehicle.manufacturer]}</TableCell>
                    <TableCell>{vehicle.observations}</TableCell>
                    <TableCell>{vehicle.licensePlate}</TableCell>
                    <TableCell>{vehicle.chassis}</TableCell>
                    <TableCell>{vehicle.manufactureYear}</TableCell>
                    <TableCell>{vehicle.modelYear}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleSelectVehicle(vehicle)}>
                        Selecionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Contracts;
