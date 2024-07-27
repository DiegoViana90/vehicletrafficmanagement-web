import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Layout from './Layout';
import { getAllVehiclesFromCompany, getContractByCompanyName, updateContract } from '../services/api';
import { GetVehicleDto, ContractDto, UpdateContractRequestDto } from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContractStatus, VehicleStatus, VehicleManufacturers } from '../constants/enum';

const UpdateContract: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const contract: ContractDto = location.state?.contract;

  const [vehicles, setVehicles] = useState<GetVehicleDto[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<GetVehicleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UpdateContractRequestDto>({
    Id: contract?.id || 0,
    ServiceProviderCompanyId: contract?.serviceProviderCompanyId || 0,
    ClientCompanyId: contract?.clientCompanyId || 0,
    StartDate: contract?.startDate.split('T')[0] || '',
    EndDate: contract?.endDate ? contract.endDate.split('T')[0] : '',
    Status: contract?.status || ContractStatus.Ativo,
    VehicleIds: contract?.vehicleIds || [],
  });
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const company = JSON.parse(localStorage.getItem('company') || '{}');
  const companiesId = company.id;

  useEffect(() => {
    const fetchData = async () => {
      if (contract) {
        try {
          const vehicleResponse = await getAllVehiclesFromCompany(companiesId);
          setVehicles(vehicleResponse);
          setSelectedVehicles(vehicleResponse.filter(v => contract.vehicleIds.includes(v.id)));
        } catch (error) {
          toast.error('Erro ao carregar veículos.');
        } finally {
          setLoading(false);
        }
      } else {
        toast.error('Contrato não encontrado.');
        navigate('/contracts');
      }
    };
    fetchData();
  }, [contract, navigate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    const enumStatus = Object.keys(ContractStatus).find((key) => ContractStatus[key as keyof typeof ContractStatus] === value);
    setFormData((prevData) => ({
      ...prevData,
      [name as string]: name === "status" && enumStatus ? ContractStatus[enumStatus as keyof typeof ContractStatus] : value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await updateContract(formData);
      toast.success('Contrato atualizado com sucesso!');
      await fetchUpdatedContract();
    } catch (error) {
      toast.error('Erro ao atualizar contrato.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdatedContract = async () => {
    try {
      const updatedContract = await getContractByCompanyName({ Name: company.tradeName });
      setFormData({
        Id: updatedContract.id,
        ServiceProviderCompanyId: updatedContract.serviceProviderCompanyId,
        ClientCompanyId: updatedContract.clientCompanyId,
        StartDate: updatedContract.startDate.split('T')[0],
        EndDate: updatedContract.endDate ? updatedContract.endDate.split('T')[0] : '',
        Status: updatedContract.status,
        VehicleIds: updatedContract.vehicleIds,
      });
      const vehicleResponse = await getAllVehiclesFromCompany(companiesId);
      setVehicles(vehicleResponse);
      setSelectedVehicles(vehicleResponse.filter(v => updatedContract.vehicleIds.includes(v.id)));
    } catch (error) {
      toast.error('Erro ao buscar contrato atualizado.');
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
    (vehicle.status === VehicleStatus.Livre) &&
    (vehicle.licensePlate.includes(searchQuery.toUpperCase()) || vehicle.chassis.includes(searchQuery.toUpperCase()))
  );

  const isFormValid = formData.ClientCompanyId !== 0 && selectedVehicles.length > 0;

  return (
    <Layout>
      <Container maxWidth="md">
        <Box mt={10} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Atualizar Contrato
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
                <TextField
                  fullWidth
                  label="ID"
                  name="id"
                  type="text"
                  value={formData.Id}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ID da Empresa Prestadora"
                  name="serviceProviderCompanyId"
                  type="text"
                  value={formData.ServiceProviderCompanyId}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ID da Empresa Cliente"
                  name="clientCompanyId"
                  type="text"
                  value={formData.ClientCompanyId}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Início"
                  name="startDate"
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
                  name="endDate"
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
                    name="status"
                    value={formData.Status}
                    onChange={(e) => handleChange(e as React.ChangeEvent<{ name?: string; value: unknown }>)}
                    label="Status"
                  >
                    <MenuItem value={ContractStatus.Ativo}>Ativo</MenuItem>
                    <MenuItem value={ContractStatus.Inativo}>Inativo</MenuItem>
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
                  <Button type="submit" variant="contained" color="primary" disabled={!isFormValid || loading}>
                    {loading ? <CircularProgress size={24} /> : 'Atualizar Contrato'}
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

export default UpdateContract;
