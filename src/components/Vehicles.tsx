import React, { useState, useEffect, ChangeEvent } from 'react';
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
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  IconButton,
  SelectChangeEvent
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { getAllVehicleModels, insertVehicle, insertVehicleModel, getVehicleByChassis, getVehicleByLicensePlate } from '../services/api';
import { toast } from 'react-toastify';
import { VehicleModelDtoResponse, InsertVehicleRequestDto, GetVehicleDto } from '../services/api';
import { VehicleStatus, FuelType, VehicleManufacturers } from '../constants/enum';

const Vehicles: React.FC = () => {
  const navigate = useNavigate();
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
    ManufactureYear: '',
    ModelYear: '',
    CompaniesId: 0,
    renavam: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [newVehicleModel, setNewVehicleModel] = useState({
    modelName: '',
    manufacturer: 0,
    observations: ''
  });
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const [isInsertModelLoading, setIsInsertModelLoading] = useState(false);
  const [hasFetchedVehicle, setHasFetchedVehicle] = useState(false);
  const [selectedVehicleModel, setSelectedVehicleModel] = useState<string>('');

  useEffect(() => {
    const company = JSON.parse(localStorage.getItem('company') || '{}');
    const companiesId = company.id;
    setVehicleData((prevData) => ({
      ...prevData,
      CompaniesId: companiesId,
    }));
    fetchVehicleModels();
  }, [query]);

  useEffect(() => {
    const fetchVehicleByLicensePlate = async () => {
      if (vehicleData.LicensePlate && vehicleData.LicensePlate.replace(/[^A-Z0-9]/g, '').length === 7) {
        try {
          const response: GetVehicleDto | null = await getVehicleByLicensePlate(vehicleData.LicensePlate, vehicleData.CompaniesId);
          if (response) {
            setVehicleData((prevData) => ({
              ...prevData,
              VehicleModelId: response.vehicleModelId,
              LicensePlate: response.licensePlate,
              Chassis: response.chassis,
              Color: response.color,
              FuelType: response.fuelType,
              Mileage: response.mileage,
              Status: response.status,
              ContractId: response.contractId,
              ManufactureYear: response.manufactureYear,
              ModelYear: response.modelYear,
              renavam: response.renavam,
            }));
            setSelectedVehicleModel(`${response.modelName} | ${VehicleManufacturers[response.manufacturer]} | ${response.observations}`);
            setHasFetchedVehicle(true);
            toast.success('Veículo já cadastrado.');
            setFieldsDisabled(true);
          }
        } catch (error) {
          console.error('Erro ao buscar veículo por placa:', error);
          toast.error('Erro ao buscar veículo por placa.');
        }
      }
    };

    if (!hasFetchedVehicle) {
      fetchVehicleByLicensePlate();
    }
  }, [vehicleData.LicensePlate, hasFetchedVehicle]);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (vehicleData.Chassis.length === 17 && !hasFetchedVehicle) {
        try {
          const response: GetVehicleDto | null = await getVehicleByChassis(vehicleData.Chassis, vehicleData.CompaniesId);
          if (response) {
            setVehicleData((prevData) => ({
              ...prevData,
              VehicleModelId: response.vehicleModelId,
              LicensePlate: response.licensePlate,
              Chassis: response.chassis,
              Color: response.color,
              FuelType: response.fuelType,
              Mileage: response.mileage,
              Status: response.status,
              ContractId: response.contractId,
              ManufactureYear: response.manufactureYear,
              ModelYear: response.modelYear,
              renavam: response.renavam,
            }));
            setSelectedVehicleModel(`${response.modelName} | ${VehicleManufacturers[response.manufacturer]} | ${response.observations}`);
            setHasFetchedVehicle(true);
            toast.success('Veículo já cadastrado.');
            setFieldsDisabled(true);
          }
        } catch (error) {
          console.error('Erro ao buscar veículo por chassi:', error);
          toast.error('Erro ao buscar veículo por chassi.');
        }
      } else {
        setFieldsDisabled(false);
      }
    };

    if (!hasFetchedVehicle) {
      fetchVehicle();
    }
  }, [vehicleData.Chassis, hasFetchedVehicle]);

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

  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;

    setVehicleData((prevData) => {
      if (name === 'Status') {
        return {
          ...prevData,
          [name]: Number(value),
          ContractId: value === VehicleStatus['Em Contrato'] ? prevData.ContractId : undefined,
        };
      }

      return {
        ...prevData,
        [name]: Number(value),
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
    setHasFetchedVehicle(false);
  };

  const handleChassisChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const formattedValue = value.toUpperCase().slice(0, 17);
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
    setHasFetchedVehicle(false);
  };

  const handleYearChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length <= 4) {
      setVehicleData((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));
    }
  };

  const validateForm = () => {
    const isLicensePlateValid = vehicleData.LicensePlate?.replace(/[^A-Z0-9]/g, '').length === 7;
    const isChassisValid = vehicleData.Chassis?.length === 17;
    const isColorValid = vehicleData.Color?.trim() !== '';
    const isFuelTypeValid = vehicleData.FuelType !== FuelType['Selecione uma Opção'];
    const isMileageValid = vehicleData.Mileage > 0;
    const isStatusValid = vehicleData.Status !== VehicleStatus['Selecione uma Opção'];
    const isContractIdValid = vehicleData.Status === VehicleStatus['Em Contrato'] ? vehicleData.ContractId !== undefined : true;
    const isModelValid = vehicleData.VehicleModelId !== 0;
    const isManufactureYearValid = vehicleData.ManufactureYear?.trim() !== '';
    const isModelYearValid = vehicleData.ModelYear?.trim() !== '';
    const isRenavamValid = vehicleData.renavam?.trim() !== '';

    setIsFormValid(
      isLicensePlateValid &&
      isChassisValid &&
      isColorValid &&
      isFuelTypeValid &&
      isMileageValid &&
      isStatusValid &&
      isContractIdValid &&
      isModelValid &&
      isManufactureYearValid &&
      isModelYearValid &&
      isRenavamValid
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
      clearForm();
    } catch (error) {
      toast.error('Erro ao inserir veículo.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    const company = JSON.parse(localStorage.getItem('company') || '{}');
    const companiesId = company.id;

    setVehicleData({
      VehicleModelId: 0,
      LicensePlate: '',
      Chassis: '',
      Color: '',
      FuelType: FuelType['Selecione uma Opção'],
      Mileage: 0,
      Status: VehicleStatus['Selecione uma Opção'],
      ContractId: undefined,
      ManufactureYear: '',
      ModelYear: '',
      CompaniesId: companiesId,
      renavam: '',
    });
    setFieldsDisabled(false);
    setHasFetchedVehicle(false);
    setSelectedVehicleModel('');
  };

  const handleOpen = () => {
    setNewVehicleModel({
      modelName: '',
      manufacturer: 0,
      observations: ''
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const trimTrailingSpaces = (str: string): string => {
    return str.replace(/\s+$/, '');
  };

  const handleNewModelChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>) => {
    const { name, value } = event.target;
    setNewVehicleModel((prevData) => ({
      ...prevData,
      [name as string]: value,
    }));
  };

  const handleInsertNewModel = async () => {
    setIsInsertModelLoading(true);
    try {
      const trimmedVehicleModel = {
        ...newVehicleModel,
        modelName: trimTrailingSpaces(newVehicleModel.modelName),
        observations: trimTrailingSpaces(newVehicleModel.observations)
      };

      await insertVehicleModel(trimmedVehicleModel);
      toast.success('Modelo de veículo inserido com sucesso!');
      setNewVehicleModel({
        modelName: '',
        manufacturer: 0,
        observations: ''
      });
      fetchVehicleModels();
    } catch (error) {
      toast.error('Erro ao inserir modelo de veículo.');
    } finally {
      setIsInsertModelLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Box mt={10} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Adicionar Veículos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => navigate('/search-vehicle')}
          >
            Buscar Veículos
          </Button>
        </Box>
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
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Placa"
                name="LicensePlate"
                value={vehicleData.LicensePlate}
                onChange={handleLicensePlateChange}
                variant="outlined"
                disabled={fieldsDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Chassi"
                name="Chassis"
                value={vehicleData.Chassis}
                onChange={handleChassisChange}
                variant="outlined"
                disabled={fieldsDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="RENAVAM"
                name="renavam"
                value={vehicleData.renavam}
                onChange={handleChange}
                variant="outlined"
                disabled={fieldsDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {fieldsDisabled ? (
                <TextField
                  fullWidth
                  label="Modelo de Veículo"
                  value={selectedVehicleModel}
                  variant="outlined"
                  disabled
                />
              ) : (
                <Autocomplete
                  options={vehicleModels}
                  getOptionLabel={(option) => `${option.modelName} | ${VehicleManufacturers[option.manufacturer]} | ${option.observations}`}
                  renderOption={(props, option) => (
                    <Tooltip title={`${option.modelName} | ${VehicleManufacturers[option.manufacturer]} | ${option.observations}`}>
                      <Box component="li" {...props}>
                        {option.modelName}
                      </Box>
                    </Tooltip>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Modelo de Veículo"
                      variant="outlined"
                      onChange={(e) => setQuery(e.target.value)}
                      value={vehicleModels.find(vm => vm.vehicleModelId === vehicleData.VehicleModelId)?.modelName || ''}
                      disabled={fieldsDisabled}
                    />
                  )}
                  onChange={handleModelChange}
                  loading={loading}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" justifyContent="flex-end" alignItems="center" height="100%">
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={handleOpen}
                  disabled={fieldsDisabled}
                >
                  Adicionar Novo Modelo
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ano Fabricação"
                name="ManufactureYear"
                type="number"
                value={vehicleData.ManufactureYear}
                onChange={handleYearChange}
                variant="outlined"
                disabled={fieldsDisabled}
                inputProps={{ maxLength: 4 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ano Modelo"
                name="ModelYear"
                type="number"
                value={vehicleData.ModelYear}
                onChange={handleYearChange}
                variant="outlined"
                disabled={fieldsDisabled}
                inputProps={{ maxLength: 4 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cor"
                name="Color"
                value={vehicleData.Color}
                onChange={handleChange}
                variant="outlined"
                disabled={fieldsDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tipo de Combustível</InputLabel>
                <Select
                  name="FuelType"
                  value={vehicleData.FuelType}
                  onChange={handleSelectChange}
                  label="Tipo de Combustível"
                  disabled={fieldsDisabled}
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
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status do Veículo</InputLabel>
                <Select
                  name="Status"
                  value={vehicleData.Status}
                  onChange={handleSelectChange}
                  label="Status do Veículo"
                  disabled={fieldsDisabled}
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID do Contrato"
                name="ContractId"
                type="number"
                value={vehicleData.ContractId !== undefined ? vehicleData.ContractId : ''}
                onChange={handleChange}
                variant="outlined"
                disabled={vehicleData.Status !== VehicleStatus['Em Contrato'] || fieldsDisabled}
              />
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
                disabled={fieldsDisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || !isFormValid || fieldsDisabled}
                >
                  {loading ? <CircularProgress size={24} /> : 'Inserir Veículo'}
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Adicionar Novo Modelo de Veículo
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Montadora</InputLabel>
            <Select
              name="manufacturer"
              value={newVehicleModel.manufacturer}
              onChange={handleNewModelChange}
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
            autoFocus
            margin="dense"
            label="Modelo de Veículo"
            name="modelName"
            fullWidth
            value={newVehicleModel.modelName}
            onChange={handleNewModelChange}
          />
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
          <Button onClick={handleClose} color="primary" disabled={isInsertModelLoading}>
            Cancelar
          </Button>
          <Button onClick={handleInsertNewModel} color="primary" variant="contained" disabled={isInsertModelLoading || newVehicleModel.modelName.trim() === ''}>
            {isInsertModelLoading ? <CircularProgress size={24} /> : 'Inserir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Vehicles;
