import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Box, Typography, CircularProgress, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Layout from './Layout';
import { getAllVehicleModels, insertVehicle } from '../services/api';
import { toast } from 'react-toastify';
import { VehicleModelDtoResponse, InsertVehicleRequestDto, FuelType, VehicleStatus } from '../services/api';

const Vehicles: React.FC = () => {
  const [vehicleModels, setVehicleModels] = useState<VehicleModelDtoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<InsertVehicleRequestDto>({
    VehicleModelId: 0,
    LicensePlate: '',
    Chassis: '',
    Color: '',
    FuelType: FuelType.Flex,
    Mileage: 0,
    Status: VehicleStatus.Livre,
    ContractId: undefined,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    fetchVehicleModels();
  }, []);

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

  const handleSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name as string]: Number(value),
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLicensePlateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleChassisChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    setIsFormValid(isLicensePlateValid && isChassisValid);
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
        FuelType: FuelType.Flex,
        Mileage: 0,
        Status: VehicleStatus.Livre,
        ContractId: undefined,
      });
    } catch (error) {
      toast.error('Erro ao inserir veículo.');
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
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Modelo de Veículo</InputLabel>
                  <Select
                    name="VehicleModelId"
                    value={vehicleData.VehicleModelId}
                    onChange={(event) => handleSelectChange(event as React.ChangeEvent<{ name?: string; value: unknown }>)}
                    label="Modelo de Veículo"
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return <em>Selecione um modelo de veículo</em>;
                      }
                      const selectedModel = vehicleModels.find(model => model.vehicleModelId === selected);
                      return selectedModel ? `${selectedModel.modelName} | ${selectedModel.manufacturer} | ${selectedModel.observations}` : 'Selecione um modelo de veículo';
                    }}
                  >
                    <MenuItem value="" disabled>
                      Selecione um modelo de veículo
                    </MenuItem>
                    {vehicleModels.map((model) => (
                      <MenuItem key={model.vehicleModelId} value={model.vehicleModelId}>
                        {`${model.modelName} | ${model.manufacturer} | ${model.observations}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                    onChange={(event) => handleSelectChange(event as React.ChangeEvent<{ name?: string; value: unknown }>)}
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
                    onChange={(event) => handleSelectChange(event as React.ChangeEvent<{ name?: string; value: unknown }>)}
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
    </Layout>
  );
};

export default Vehicles;
