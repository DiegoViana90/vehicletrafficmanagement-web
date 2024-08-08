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
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
} from '@mui/material';
import { toast } from 'react-toastify';
import { insertFine, getVehicleByLicensePlate, getFineByFineNumberAndVehicleId, FineDto } from '../services/api';
import { EnforcingAgency, FineStatus } from '../constants/enum';
import { format, isBefore, startOfDay, addDays } from 'date-fns';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';

const Fines: React.FC = () => {
  const navigate = useNavigate();
  const [fineData, setFineData] = useState<FineDto>({
    RegistrationDate: new Date(),
    VehicleId: 0,
    FineNumber: '',
    LicensePlate: '',
    FineDateTime: new Date(),
    FineDueDate: addDays(new Date(), 1),
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
  const [vehicleFound, setVehicleFound] = useState(false);
  const [licensePlate, setLicensePlate] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [dueDateError, setDueDateError] = useState('');
  const [includeDiscount, setIncludeDiscount] = useState(true);
  const [includeInterest, setIncludeInterest] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showExistingFineModal, setShowExistingFineModal] = useState(false);

  const validateForm = () => {
    const isValid =
      fineData.FineNumber.trim() !== '' &&
      fineData.FineDueDate instanceof Date &&
      fineData.EnforcingAgency !== EnforcingAgency.Outros &&
      fineData.FineLocation.trim() !== '' &&
      fineData.FineAmount > 0 &&
      fineData.FinalFineAmount >= 0 &&
      vehicleFound;
    setIsFormValid(isValid);
  };

  useEffect(() => {
    validateForm();
  }, [fineData, vehicleFound]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFineData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const date = new Date(value);
    const currentDate = startOfDay(new Date());

    if (isNaN(date.getTime())) {
      if (name === 'FineDueDate') {
        setDueDateError('Data inválida');
      }
    } else {
      if (name === 'FineDueDate') {
        setDueDateError('');
        const isPastDueDate = isBefore(date, currentDate) || date.getTime() === currentDate.getTime();
        setFineData((prevData) => ({
          ...prevData,
          [name]: date,
          FineStatus: isPastDueDate ? FineStatus.Vencido : FineStatus.Ativo,
        }));
      } else {
        setFineData((prevData) => ({
          ...prevData,
          [name]: date,
        }));
      }
    }
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (name === 'includeDiscount') {
      setIncludeDiscount(checked);
      if (!checked) {
        setFineData((prevData) => ({
          ...prevData,
          DiscountedFineAmount: 0,
        }));
      }
    } else if (name === 'includeInterest') {
      setIncludeInterest(checked);
      if (!checked) {
        setFineData((prevData) => ({
          ...prevData,
          InterestFineAmount: 0,
        }));
      }
    }
  };

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const formattedValue = value.slice(0, 30);
    setFineData((prevData) => ({
      ...prevData,
      [name]: Math.max(0, parseFloat(formattedValue)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const existingFine = await getFineByFineNumberAndVehicleId(fineData.FineNumber, fineData.VehicleId);
      if (existingFine) {
        setShowExistingFineModal(true);
      } else {
        const updatedFineData = {
          ...fineData,
          FineDueDate: new Date(fineData.FineDueDate.setHours(0, 0, 0, 0)), // Ajuste a FineDueDate para ser uma data sem hora
        };
        await insertFine(updatedFineData);
        toast.success('Multa criada com sucesso!');
        clearForm();
      }
    } catch (error) {
      toast.error('Erro ao criar multa.');
    } finally {
      setLoading(false);
    }
  };

  const handleLicensePlateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    let formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);

    if (formattedValue.length > 3) {
      formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3)}`;
    }

    setLicensePlate(formattedValue);
  };

  const handleVehicleSearch = async () => {
    setLoading(true);
    try {
      const company = JSON.parse(localStorage.getItem('company') || '{}');
      const companiesId = company.id;
      const vehicle = await getVehicleByLicensePlate(licensePlate, companiesId);
      if (vehicle) {
        setFineData((prevData) => ({
          ...prevData,
          VehicleId: vehicle.id,
          LicensePlate: vehicle.licensePlate,
        }));
        setVehicleFound(true);
        toast.success('Veículo encontrado!');
      } else {
        setVehicleFound(false);
        toast.error('Veículo não encontrado.');
      }
    } catch (error) {
      setVehicleFound(false);
      toast.error('Erro ao buscar veículo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const clearForm = () => {
    setFineData({
      RegistrationDate: new Date(),
      VehicleId: 0,
      FineNumber: '',
      LicensePlate: '',
      FineDateTime: new Date(),
      FineDueDate: addDays(new Date(), 1),
      EnforcingAgency: EnforcingAgency.Outros,
      FineLocation: '',
      FineAmount: 0,
      DiscountedFineAmount: 0,
      InterestFineAmount: 0,
      FinalFineAmount: 0,
      FineStatus: FineStatus.Ativo,
      Description: '',
    });
    setLicensePlate('');
    setVehicleFound(false);
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

  const handleSelectChange = (event: SelectChangeEvent<EnforcingAgency | FineStatus>) => {
    const { name, value } = event.target;
    setFineData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Box mt={10} display="flex" justifyContent="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Adicionar Multa
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Número da Multa"
                name="FineNumber"
                value={fineData.FineNumber}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Placa do Veículo"
                name="LicensePlate"
                value={licensePlate}
                onChange={handleLicensePlateChange}
                variant="outlined"
                required
                disabled={vehicleFound}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleVehicleSearch}
                disabled={loading || vehicleFound || licensePlate.length !== 8}
              >
                {loading ? <CircularProgress size={24} /> : 'Buscar Veículo'}
              </Button>
            </Grid>
            {vehicleFound && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Data da Multa"
                    name="FineDateTime"
                    type="datetime-local"
                    value={formatToLocalDateTime(fineData.FineDateTime)}
                    onChange={handleDateChange}
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
                    value={formatToDateOnly(fineData.FineDueDate)}
                    onChange={handleDateChange}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    error={!!dueDateError}
                    helperText={dueDateError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>Órgão Autuador</InputLabel>
                    <Select
                      name="EnforcingAgency"
                      value={fineData.EnforcingAgency}
                      onChange={handleSelectChange}
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
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={includeDiscount}
                        onChange={handleCheckboxChange}
                        name="includeDiscount"
                        color="primary"
                      />
                    }
                    label="Incluir Desconto"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={includeInterest}
                        onChange={handleCheckboxChange}
                        name="includeInterest"
                        color="primary"
                      />
                    }
                    label="Incluir Juros"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Valor da Multa"
                    name="FineAmount"
                    type="number"
                    value={fineData.FineAmount}
                    onChange={handleValueChange}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: <Box component="span">R$</Box>,
                    }}
                  />
                </Grid>
                {includeDiscount && (
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Valor de Desconto"
                      name="DiscountedFineAmount"
                      type="number"
                      value={fineData.DiscountedFineAmount || ''}
                      onChange={handleValueChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Box component="span">R$</Box>,
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          color: 'green',
                          borderColor: 'green',
                        },
                        '& .MuiFormLabel-root.Mui-focused': {
                          color: 'green',
                        },
                      }}
                    />
                  </Grid>
                )}
                {includeInterest && (
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Valor com Juros"
                      name="InterestFineAmount"
                      type="number"
                      value={fineData.InterestFineAmount || ''}
                      onChange={handleValueChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Box component="span">R$</Box>,
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          color: 'red',
                          borderColor: 'red',
                        },
                        '& .MuiFormLabel-root.Mui-focused': {
                          color: 'red',
                        },
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Valor Final"
                    name="FinalFineAmount"
                    type="number"
                    value={fineData.FinalFineAmount}
                    onChange={handleValueChange}
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
                      onChange={handleSelectChange}
                      label="Status da Multa"
                    >
                      {Object.keys(FineStatus)
                        .filter((key) => isNaN(Number(key)))
                        .map((key) => (
                          <MenuItem
                            key={key}
                            value={FineStatus[key as keyof typeof FineStatus]}
                            disabled={FineStatus[key as keyof typeof FineStatus] === FineStatus.Ativo && isBefore(fineData.FineDueDate, startOfDay(new Date()))}
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
              </>
            )}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || !isFormValid}
                >
                  {loading ? <CircularProgress size={24} /> : 'Inserir Multa'}
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
        <Dialog
          open={showExistingFineModal}
          onClose={() => setShowExistingFineModal(false)}
        >
          <DialogTitle>Multa já existente</DialogTitle>
          <DialogContent>
            <Typography>
              Uma multa com este número já existe para este veículo. Deseja visualizar a multa existente ou adicionar uma nova multa?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { clearForm(); setShowExistingFineModal(false); }} color="primary">
              Adicionar Nova Multa
            </Button>
            <Button onClick={() => navigate('/update-fine')} color="primary">
              Atualizar Multa
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={showDialog}
          onClose={handleDialogClose}
        >
          <DialogTitle>Data de Vencimento</DialogTitle>
          <DialogContent>
            <Typography>
              A data de vencimento está igual ou anterior à data atual. A multa será marcada como "Vencida".
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Fines;
