import React, { useState, ChangeEvent } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import QrReader from 'react-qr-scanner';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { getVehicleByChassis, getVehicleByLicensePlate, getVehicleByQRCode } from '../services/api';
import { toast } from 'react-toastify';
import { GetVehicleDto } from '../services/api';
import { VehicleStatus, FuelType, VehicleManufacturers } from '../constants/enum';

const SearchVehicle: React.FC = () => {
  const [vehicleData, setVehicleData] = useState<GetVehicleDto | null>(null);
  const [licensePlate, setLicensePlate] = useState('');
  const [chassis, setChassis] = useState('');
  const [loading, setLoading] = useState(false);
  const [openQrReader, setOpenQrReader] = useState(false);
  const [hasFetchedVehicle, setHasFetchedVehicle] = useState(false);

  const company = JSON.parse(localStorage.getItem('company') || '{}');
  const companiesId = company.id;
  const navigate = useNavigate();

  const handleSearchByLicensePlate = async () => {
    setLoading(true);
    try {
      const response = await getVehicleByLicensePlate(licensePlate, companiesId);
      setVehicleData(response);
      if (response) {
        setHasFetchedVehicle(true);
        toast.success('Veículo encontrado!');
      } else {
        toast.error('Veículo não encontrado.');
      }
    } catch (error) {
      toast.error('Erro ao buscar veículo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByChassis = async () => {
    setLoading(true);
    try {
      const response = await getVehicleByChassis(chassis, companiesId);
      setVehicleData(response);
      if (response) {
        setHasFetchedVehicle(true);
        toast.success('Veículo encontrado!');
      } else {
        toast.error('Veículo não encontrado.');
      }
    } catch (error) {
      toast.error('Erro ao buscar veículo.');
    } finally {
      setLoading(false);
    }
  };

  const handleQrScan = async (data: any) => {
    if (data && data.text) {
      setLoading(true);
      setOpenQrReader(false);
      try {
        const response = await getVehicleByQRCode(data.text, companiesId);
        setVehicleData(response);
        if (response) {
          setHasFetchedVehicle(true);
          toast.success('Veículo encontrado!');
        } else {
          toast.error('Veículo não encontrado.');
        }
      } catch (error) {
        toast.error('Erro ao buscar veículo.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleQrError = (error: any) => {
    console.error(error);
    toast.error('Erro ao ler QR Code.');
    setOpenQrReader(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'licensePlate') {
      setLicensePlate(value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7).replace(/(\w{3})(\w{4})/, '$1-$2'));
    } else if (name === 'chassis') {
      setChassis(value.toUpperCase().slice(0, 17));
    }
    setHasFetchedVehicle(false);
    setVehicleData(null);
  };

  const clearData = () => {
    setLicensePlate('');
    setChassis('');
    setVehicleData(null);
    setHasFetchedVehicle(false);
  };

  const isLicensePlateValid = licensePlate.replace('-', '').length === 7;
  const isChassisValid = chassis.length === 17;

  const handleViewHistory = () => {
    navigate('/vehicle-historic', { state: { vehicleId: vehicleData?.id } });
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Box mt={10}>
          <Typography variant="h4" component="h1" gutterBottom>
            Buscar Veículo
          </Typography>
          {!hasFetchedVehicle && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Placa"
                  name="licensePlate"
                  value={licensePlate}
                  onChange={handleInputChange}
                  variant="outlined"
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSearchByLicensePlate}
                  disabled={loading || !isLicensePlateValid}
                >
                  Buscar por Placa
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Chassi"
                  name="chassis"
                  value={chassis}
                  onChange={handleInputChange}
                  variant="outlined"
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSearchByChassis}
                  disabled={loading || !isChassisValid}
                >
                  Buscar por Chassi
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => setOpenQrReader(true)}
                  disabled={loading}
                >
                  Ler QR Code
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={clearData}
                  disabled={loading}
                >
                  Limpar Dados
                </Button>
              </Grid>
            </Grid>
          )}
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
              <CircularProgress />
              <Typography variant="h6" component="div" ml={2}>
                Carregando...
              </Typography>
            </Box>
          )}
          {vehicleData && (
            <Box mt={4}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={clearData}
                >
                  Limpar Dados
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleViewHistory}
                >
                  Histórico de Veículo
                </Button>
              </Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Dados do Veículo
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Placa"
                    value={vehicleData.licensePlate}
                    variant="outlined"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Chassi"
                    value={vehicleData.chassis}
                    variant="outlined"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="RENAVAM"
                    value={vehicleData.renavam}
                    variant="outlined"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quilometragem"
                    value={vehicleData.mileage}
                    variant="outlined"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ano Fabricação"
                    value={vehicleData.manufactureYear}
                    variant="outlined"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ano Modelo"
                    value={vehicleData.modelYear}
                    variant="outlined"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Modelo de Veículo"
                    value={`${vehicleData.modelName} | ${VehicleManufacturers[vehicleData.manufacturer]} | ${vehicleData.observations}`}
                    variant="outlined"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cor"
                    value={vehicleData.color}
                    variant="outlined"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tipo de Combustível"
                    value={FuelType[vehicleData.fuelType]}
                    variant="outlined"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Status"
                    value={VehicleStatus[vehicleData.status]}
                    variant="outlined"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ID do Contrato"
                    value={vehicleData.contractId !== undefined ? vehicleData.contractId : 'N/A'}
                    variant="outlined"
                    disabled
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          <Dialog open={openQrReader} onClose={() => setOpenQrReader(false)}>
            <DialogTitle>
              Ler QR Code
              <IconButton
                aria-label="close"
                onClick={() => setOpenQrReader(false)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <QrReader
                delay={300}
                onError={handleQrError}
                onScan={handleQrScan}
                style={{ width: '100%' }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenQrReader(false)} color="primary">
                Fechar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </Layout>
  );
};

export default SearchVehicle;
