import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Layout from './Layout';
import { getAllVehiclesFromCompany, getAllCompaniesByCompany, insertContract, getContractByCompanyName, updateContract } from '../services/api';
import { GetVehicleDto, ClientDto, InsertContractRequestDto, UpdateContractRequestDto, ContractDto } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ContractStatus, VehicleStatus, VehicleManufacturers } from '../constants/enum';

const Contracts: React.FC = () => {
  const navigate = useNavigate();
  const company = JSON.parse(localStorage.getItem('company') || '{}');
  const serviceProviderCompanyId = company.id;
  const companyRelated = company.id;
  const [vehicles, setVehicles] = useState<GetVehicleDto[]>([]);
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<GetVehicleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [existingContract, setExistingContract] = useState<ContractDto | null>(null);
  const [showContractDialog, setShowContractDialog] = useState(false);
  const [formData, setFormData] = useState<InsertContractRequestDto>({
    ServiceProviderCompanyId: serviceProviderCompanyId,
    ClientCompanyId: 0,
    StartDate: '',
    EndDate: '',
    Status: ContractStatus.Ativo,
    VehicleIds: [],
  });
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientDto | null>(null);
  const [selectedTaxNumber, setSelectedTaxNumber] = useState<string>('');

  const fetchData = async () => {
    try {
      const vehicleResponse = await getAllVehiclesFromCompany({ CompaniesId: serviceProviderCompanyId });
      const clientResponse = await getAllCompaniesByCompany({ CompanyRelated: companyRelated });
      setVehicles(vehicleResponse);
      setClients(clientResponse);
    } catch (error) {
      toast.error('Erro ao carregar veículos e clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [serviceProviderCompanyId, companyRelated]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name as string]: value,
    }));
  };

  const handleClientChange = async (event: any, newValue: ClientDto | null) => {
    setSelectedClientId(newValue ? newValue.companiesId : null);
    setSelectedClient(newValue);
    setSelectedTaxNumber(newValue ? newValue.taxNumber : '');
    if (newValue) {
      try {
        const contract = await getContractByCompanyName({ Name: newValue.name, CompaniesId: serviceProviderCompanyId });
        setExistingContract(contract);
        setShowContractDialog(true);
      } catch (error) {
        setFormData((prevData) => ({
          ...prevData,
          ClientCompanyId: newValue.companiesId,
        }));
        setExistingContract(null);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        ClientCompanyId: 0,
      }));
      setExistingContract(null);
    }
  };

  const handleViewContract = () => {
    setFormData({
      ServiceProviderCompanyId: existingContract!.serviceProviderCompanyId,
      ClientCompanyId: existingContract!.clientCompanyId,
      StartDate: existingContract!.startDate.split('T')[0],
      EndDate: existingContract!.endDate ? existingContract!.endDate.split('T')[0] : '',
      Status: existingContract!.status,
      VehicleIds: existingContract!.vehicleIds,
    });
    setSelectedVehicles(vehicles.filter(vehicle => existingContract!.vehicleIds.includes(vehicle.id)));
    setIsViewOnly(true);
    setShowContractDialog(false);
  };

  const handleUpdateContract = () => {
    setFormData({
      ServiceProviderCompanyId: existingContract!.serviceProviderCompanyId,
      ClientCompanyId: existingContract!.clientCompanyId,
      StartDate: existingContract!.startDate.split('T')[0],
      EndDate: existingContract!.endDate ? existingContract!.endDate.split('T')[0] : '',
      Status: existingContract!.status,
      VehicleIds: existingContract!.vehicleIds,
    });
    setSelectedVehicles(vehicles.filter(vehicle => existingContract!.vehicleIds.includes(vehicle.id)));
    setIsViewOnly(false);
    setShowContractDialog(false);
  };

  const handleClearForm = () => {
    setFormData({
      ServiceProviderCompanyId: serviceProviderCompanyId,
      ClientCompanyId: 0,
      StartDate: '',
      EndDate: '',
      Status: ContractStatus.Ativo,
      VehicleIds: [],
    });
    setSelectedVehicles([]);
    setSelectedClientId(null);
    setIsViewOnly(false);
    setExistingContract(null);
    setSelectedClient(null);
    setSelectedTaxNumber('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const clientCompanyIdToSend = selectedClientId !== null ? selectedClientId : formData.ClientCompanyId;
    const updatedFormData = {
      ...formData,
      ClientCompanyId: clientCompanyIdToSend,
      VehicleIds: selectedVehicles.map(vehicle => vehicle.id),
    };
    try {
      if (existingContract) {
        const updateFormData: UpdateContractRequestDto = {
          ...updatedFormData,
          Id: existingContract.id,
        };
        await updateContract(updateFormData);
        toast.success('Contrato atualizado com sucesso!');
      } else {
        await insertContract(updatedFormData);
        toast.success('Contrato inserido com sucesso!');
      }
      await fetchData(); // Recarrega os dados após inserção ou atualização
      handleClearForm();
    } catch (error) {
      toast.error('Erro ao salvar contrato.');
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
    (vehicle.status === VehicleStatus.Livre) &&
    (vehicle.licensePlate.includes(searchQuery.toUpperCase()) || vehicle.chassis.includes(searchQuery.toUpperCase()))
  );

  const isFormValid = formData.ClientCompanyId !== 0;

  return (
    <Layout>
      <Container maxWidth="md">
        <Box mt={10} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            {existingContract ? 'Atualizar Contrato' : 'Inserir Contrato'}
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
                <Autocomplete
                  options={clients}
                  getOptionLabel={(option) => option.name}
                  value={selectedClient}
                  onChange={handleClientChange}
                  renderOption={(props, option) => (
                    <Tooltip title={option.name}>
                      <Box component="li" {...props} key={option.companiesId}>
                        {option.name}
                      </Box>
                    </Tooltip>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cliente"
                      variant="outlined"
                      disabled={isViewOnly}
                    />
                  )}
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CPF/CNPJ"
                  name="taxNumber"
                  value={selectedTaxNumber}
                  variant="outlined"
                  disabled
                />
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
                  disabled={isViewOnly}
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
                  disabled={isViewOnly}
                />
              </Grid>
              {existingContract && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="Status"
                      value={formData.Status}
                      onChange={(e) => handleChange(e as React.ChangeEvent<{ name?: string; value: unknown }>)}
                      label="Status"
                      disabled={isViewOnly}
                    >
                      <MenuItem value={ContractStatus.Ativo}>Ativo</MenuItem>
                      <MenuItem value={ContractStatus.Inativo}>Inativo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" alignItems="center" height="100%">
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                    disabled={isViewOnly}
                  >
                    Selecionar Veículos
                  </Button>
                </Box>
              </Grid>
              {!existingContract && selectedVehicles.length > 0 && (
                <Grid item xs={12}>
                  <Box mt={4}>
                    <Typography variant="h6">Veículos Selecionados:</Typography>
                    <TableContainer component={Paper}>
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
                          {selectedVehicles.map((vehicle) => (
                            <TableRow key={vehicle.id}>
                              <TableCell>{vehicle.modelName}</TableCell>
                              <TableCell>{VehicleManufacturers[vehicle.manufacturer]}</TableCell>
                              <TableCell>{vehicle.observations}</TableCell>
                              <TableCell>{vehicle.licensePlate}</TableCell>
                              <TableCell>{vehicle.chassis}</TableCell>
                              <TableCell>{vehicle.manufactureYear}</TableCell>
                              <TableCell>{vehicle.modelYear}</TableCell>
                              <TableCell>
                                <Button variant="contained" color="secondary" onClick={() => handleRemoveVehicle(vehicle.id)} disabled={isViewOnly}>
                                  Remover
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" gap={2}>
                  {!isViewOnly && (
                    <Button type="submit" variant="contained" color="primary" disabled={!isFormValid || loading}>
                      {loading ? <CircularProgress size={24} /> : existingContract ? 'Atualizar Contrato' : 'Inserir Contrato'}
                    </Button>
                  )}
                  <Button type="button" variant="contained" color="secondary" onClick={handleClearForm} disabled={loading}>
                    Limpar dados
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
        {existingContract && (
          <Box mt={4}>
            <Typography variant="h6">Veículos Associados ao Contrato:</Typography>
            <TableContainer component={Paper}>
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
                  {selectedVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>{vehicle.modelName}</TableCell>
                      <TableCell>{VehicleManufacturers[vehicle.manufacturer]}</TableCell>
                      <TableCell>{vehicle.observations}</TableCell>
                      <TableCell>{vehicle.licensePlate}</TableCell>
                      <TableCell>{vehicle.chassis}</TableCell>
                      <TableCell>{vehicle.manufactureYear}</TableCell>
                      <TableCell>{vehicle.modelYear}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="secondary" onClick={() => handleRemoveVehicle(vehicle.id)} disabled={isViewOnly}>
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
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
                      <Button variant="contained" color="primary" onClick={() => handleSelectVehicle(vehicle)} disabled={isViewOnly}>
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
      <Dialog open={showContractDialog} onClose={() => setShowContractDialog(false)}>
        <DialogTitle>Contrato Existente</DialogTitle>
        <DialogContent>
          <Typography>O cliente já possui um contrato. Deseja visualizar ou atualizar?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewContract}>Visualizar</Button>
          <Button onClick={handleUpdateContract}>Atualizar</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Contracts;
