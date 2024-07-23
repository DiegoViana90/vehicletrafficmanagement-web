import React, { useState, useEffect, ChangeEvent } from 'react';
import { Container, TextField, Button, Box, Typography, CircularProgress, Grid, MenuItem, Select, InputLabel, FormControl, Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, SelectChangeEvent } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Layout from './Layout';
import { getAllVehicleModels, insertVehicle, insertVehicleModel } from '../services/api';
import { toast } from 'react-toastify';
import { VehicleModelDtoResponse, InsertVehicleRequestDto } from '../services/api';
import { VehicleStatus, FuelType, VehicleManufacturers } from '../constants/enum';

const Vehicles: React.FC = () => {
  const [vehicleModels, setVehicleModels] = useState<VehicleModelDtoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<InsertVehicleRequestDto>({
    VehicleModelId: 0,
    LicensePlate: '',
    Chassis: '',
    Color: '',
    FuelType: FuelType['Selecione uma Opção'],
    Mileage: 0,
    Status: VehicleStatus['Selecione uma Opção'], 
    ContractId: undefined,
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [newVehicleModel, setNewVehicleModel] = useState({
    modelName: '',
    manufacturer: 0,
    observations: ''
  });

  useEffect(() => {
    fetchVehicleModels();
  }, [query]);

  const fetchVehicleModels = async () => {
    setLoading(true);
    try {
      const response = await getAllVehicleModels();
      setVehicleModels(response);
    } catch (error) {
      toast.error('Erro ao carregar modelos de veículos.');
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (event: any, newValue: VehicleModelDtoResponse | null) => {
    setVehicleData((prevData) => ({
      ...prevData,
      VehicleModelId: newValue ? newValue.vehicleModelId : 0,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<number>, child: React.ReactNode) => {
    const { name, value } = event.target;
  
    setVehicleData((prevData) => {
      if (name === 'Status') {
        return {
          ...prevData,
          [name as string]: Number(value),
          ContractId: value === VehicleStatus['Em Contrato'] ? prevData.ContractId : undefined,
        };
      }
  
      return {
        ...prevData,
        [name as string]: Number(value),
      };
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLicensePlateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const formattedValue = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 7)
      .replace(/(\w{3})(\w{4})/, '$1-$2');
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const handleChassisChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const formattedValue = value.toUpperCase().slice(0, 17);
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const validateForm = () => {
    const isLicensePlateValid = vehicleData.LicensePlate?.replace(/[^A-Z0-9]/g, '').length === 7;
    const isChassisValid = vehicleData.Chassis?.length === 17;
    const isColorValid = vehicleData.Color.trim() !== '';
    const isFuelTypeValid = vehicleData.FuelType !== undefined;
    const isMileageValid = vehicleData.Mileage > 0;
    const isStatusValid = vehicleData.Status !== undefined;
    const isContractIdValid = vehicleData.Status === VehicleStatus['Em Contrato'] ? vehicleData.ContractId !== undefined : true;
    
    setIsFormValid(
      isLicensePlateValid &&
      isChassisValid &&
      isColorValid &&
      isFuelTypeValid &&
      isMileageValid &&
      isStatusValid &&
      isContractIdValid
    );
  };

  useEffect(() => {
    validateForm();
  }, [vehicleData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await insertVehicle(vehicleData);
      toast.success('Veículo inserido com sucesso!');
      setVehicleData({
        VehicleModelId: 0,
        LicensePlate: '',
        Chassis: '',
        Color: '',
        FuelType: FuelType['Selecione uma Opção'], // Valor padrão
        Mileage: 0,
        Status: VehicleStatus['Selecione uma Opção'], // Valor padrão
        ContractId: undefined,
      });
    } catch (error) {
      toast.error('Erro ao inserir veículo.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNewModelChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>) => {
    const { name, value } = event.target;
    setNewVehicleModel((prevData) => ({
      ...prevData,
      [name as string]: value,
    }));
  };

  const handleInsertNewModel = async () => {
    setLoading(true);
    try {
      await insertVehicleModel(newVehicleModel);
      toast.success('Modelo de veículo inserido com sucesso!');
      handleClose();
      fetchVehicleModels();
    } catch (error) {
      toast.error('Erro ao inserir modelo de veículo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Box mt={10}>
          <Typography variant="h4" component="h1" gutterBottom>
            Inserção de Veículos
          </Typography>
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
              <CircularProgress />
              <Typography variant="h6" component="div" ml={2}>
                Carregando...
              </Typography>
            </Box>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Placa"
                  name="LicensePlate"
                  value={vehicleData.LicensePlate}
                  onChange={handleLicensePlateChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Chassi"
                  name="Chassis"
                  value={vehicleData.Chassis}
                  onChange={handleChassisChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={vehicleModels}
                  getOptionLabel={(option) => `${option.modelName} | ${VehicleManufacturers[option.manufacturer]} | ${option.observations}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Modelo de Veículo"
                      variant="outlined"
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  )}
                  onChange={handleModelChange}
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" justifyContent="flex-end" alignItems="center" height="100%">
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                  >
                    Adicionar NOVO Modelo
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cor"
                  name="Color"
                  value={vehicleData.Color}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Tipo de Combustível</InputLabel>
                  <Select
                    name="FuelType"
                    value={vehicleData.FuelType}
                    onChange={(event, child) => handleSelectChange(event as SelectChangeEvent<number>, child)}
                    label="Tipo de Combustível"
                  >
                    {Object.keys(FuelType)
                      .filter((key) => isNaN(Number(key)))
                      .map((key) => (
                        <MenuItem key={key} value={FuelType[key as keyof typeof FuelType]}>
                          {key}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quilometragem"
                  name="Mileage"
                  type="number"
                  value={vehicleData.Mileage}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="Status"
                    value={vehicleData.Status}
                    onChange={(event, child) => handleSelectChange(event as SelectChangeEvent<number>, child)}
                    label="Status"
                  >
                    {Object.keys(VehicleStatus)
                      .filter((key) => isNaN(Number(key)))
                      .map((key) => (
                        <MenuItem key={key} value={VehicleStatus[key as keyof typeof VehicleStatus]}>
                          {key}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ID do Contrato"
                  name="ContractId"
                  type="number"
                  value={vehicleData.ContractId !== undefined ? vehicleData.ContractId : ''}
                  onChange={handleChange}
                  variant="outlined"
                  disabled={vehicleData.Status !== VehicleStatus['Em Contrato']}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || !isFormValid}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Inserir Veículo'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Adicionar Novo Modelo de Veículo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Modelo de Veículo"
            name="modelName"
            fullWidth
            value={newVehicleModel.modelName}
            onChange={handleNewModelChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Montadora</InputLabel>
            <Select
              name="manufacturer"
              value={newVehicleModel.manufacturer}
              onChange={(event) => handleNewModelChange(event as SelectChangeEvent<number>)}
              label="Montadora"
            >
              {Object.keys(VehicleManufacturers)
                .filter((key) => isNaN(Number(key)))
                .map((key) => (
                  <MenuItem key={key} value={VehicleManufacturers[key as keyof typeof VehicleManufacturers]}>
                    {key}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Observações"
            name="observations"
            fullWidth
            value={newVehicleModel.observations}
            onChange={handleNewModelChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleInsertNewModel} color="primary" variant="contained">
            Inserir
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Vehicles;
