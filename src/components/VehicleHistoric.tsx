import React, { useState, useEffect, ChangeEvent } from 'react';
import { Container, Typography, Box, CircularProgress, Grid, Paper, TextField, Button } from '@mui/material';
import { GetVehicleHistoricResponse, getVehicleHistoric } from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { toast } from 'react-toastify';

const VehicleHistoric: React.FC = () => {
  const location = useLocation();
  const { chassi: initialChassi, licensePlate: initialLicensePlate } = location.state || {};

  const [historicData, setHistoricData] = useState<GetVehicleHistoricResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [licensePlate, setLicensePlate] = useState(initialLicensePlate || '');
  const [chassis, setChassis] = useState(initialChassi || '');
  const [searchMode, setSearchMode] = useState(true);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [startDateInclusion, setStartDateInclusion] = useState<string>('');
  const [endDateInclusion, setEndDateInclusion] = useState<string>('');
  const [filterApplied, setFilterApplied] = useState(false);
  const navigate = useNavigate();

  const fetchHistoricData = async (licensePlate?: string, chassis?: string) => {
    setLoading(true);
    try {
      const data = await getVehicleHistoric({ licensePlate, chassis });
      const sortedData = data
        .map((record: any) => ({
          ...record,
          inclusionDateTime: new Date(record.inclusionDateTime),
          removalDateTime: record.removalDateTime ? new Date(record.removalDateTime) : null,
        }))
        .sort((a, b) => b.inclusionDateTime.getTime() - a.inclusionDateTime.getTime());
      setHistoricData(sortedData);
      if (Array.isArray(data) && data.length === 0) {
        toast.warn('Nenhum histórico encontrado.');
      } else {
        toast.success('Histórico de veículo encontrado!');
      }
      setSearchMode(false);
    } catch (error) {
      toast.error('Erro ao buscar histórico do veículo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((initialLicensePlate || initialChassi) && !initialFetchDone) {
      fetchHistoricData(initialLicensePlate, initialChassi);
      setInitialFetchDone(true);
    }
  }, [initialLicensePlate, initialChassi, initialFetchDone]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'licensePlate') {
      setLicensePlate(value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7).replace(/(\w{3})(\w{4})/, '$1-$2'));
    } else if (name === 'chassis') {
      setChassis(value.toUpperCase().slice(0, 17));
    } else if (name === 'startDateInclusion') {
      setStartDateInclusion(value);
    } else if (name === 'endDateInclusion') {
      setEndDateInclusion(value);
    }
  };

  const handleSearch = () => {
    fetchHistoricData(licensePlate, chassis);
  };

  const handleNewSearch = () => {
    setHistoricData([]);
    setLicensePlate('');
    setChassis('');
    setSearchMode(true);
    setStartDateInclusion('');
    setEndDateInclusion('');
    setFilterApplied(false);
    setCurrentPage(1);
    setInitialFetchDone(false);
    navigate('/vehicle-historic', {
      state: {
        vehicleId: null,
        chassi: null,
        licensePlate: null,
      },
    });
  };

  const handleBackToSearch = () => {
    navigate('/search-vehicle');
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const applyFilter = () => {
    setFilterApplied(true);
  };

  const filterByDateInclusion = (record: GetVehicleHistoricResponse) => {
    if (!filterApplied) return true;

    const startDate = startDateInclusion ? new Date(startDateInclusion) : null;
    const endDate = endDateInclusion ? new Date(endDateInclusion) : null;

    if (startDate) {
      startDate.setHours(0, 0, 0, 0);
    }
    if (endDate) {
      // Set end date to the end of the day (23:59:59)
      endDate.setHours(23, 59, 59, 999);
    }

    if (startDate && new Date(record.inclusionDateTime) < startDate) {
      return false;
    }
    if (endDate && new Date(record.inclusionDateTime) > endDate) {
      return false;
    }

    return true;
  };

  const filteredData = historicData.filter(filterByDateInclusion);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <Layout>
      <Container maxWidth="md">
        <Box mt={10}>
          <Typography variant="h4" component="h1" gutterBottom>
            Histórico do Veículo
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Button
              variant="contained"
              color="success"
              onClick={handleBackToSearch}
            >
              Voltar para Buscar Veículo
            </Button>
            {!searchMode && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNewSearch}
              >
                Limpar Histórico, Nova Busca
              </Button>
            )}
          </Box>
          {searchMode ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Placa"
                  name="licensePlate"
                  value={licensePlate}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Chassi"
                  name="chassis"
                  value={chassis}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                >
                  Buscar Histórico
                </Button>
              </Grid>
            </Grid>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Inicio da inclusão"
                    name="startDateInclusion"
                    type="date"
                    value={startDateInclusion}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Final da inclusão"
                    name="endDateInclusion"
                    type="date"
                    value={endDateInclusion}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={applyFilter}
                    disabled={!startDateInclusion || !endDateInclusion}
                  >
                    Filtrar
                  </Button>
                </Grid>
              </Grid>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                  <CircularProgress />
                  <Typography variant="h6" component="div" ml={2}>
                    Carregando...
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2} mt={2}>
                  {paginatedData.length === 0 ? (
                    <Typography variant="h6" component="div" ml={2}>
                      Nenhum histórico encontrado.
                    </Typography>
                  ) : (
                    paginatedData.map((record) => (
                      <Grid item xs={12} key={record.vehicleHistoricId}>
                        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                          <Typography variant="h6">Contrato: {record.contractId}</Typography>
                          <Typography>Placa: {record.licensePlate}</Typography>
                          <Typography>Chassi: {record.chassi}</Typography>
                          <Typography>Empresa: {record.companyName}</Typography>
                          <Typography>CNPJ: {record.companyTaxNumber}</Typography>
                          <Typography>Data de Inclusão: {new Date(record.inclusionDateTime).toLocaleString()}</Typography>
                          {record.removalDateTime && (
                            <Typography>Data de Remoção: {new Date(record.removalDateTime).toLocaleString()}</Typography>
                          )}
                        </Paper>
                      </Grid>
                    ))
                  )}
                </Grid>
              )}
              <Box display="flex" justifyContent="center" mt={2}>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    color={currentPage === index + 1 ? 'primary' : 'inherit'}
                    onClick={() => handlePageChange(index + 1)}
                    style={{ margin: '0 5px' }}
                  >
                    {index + 1}
                  </Button>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default VehicleHistoric;
