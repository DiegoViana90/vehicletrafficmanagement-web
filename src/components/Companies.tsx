import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography, CircularProgress, Grid } from '@mui/material';
import Layout from './Layout';
import { formatCEPNumber, formatCNPJandCPF, formatPhoneNumber } from '../mask/mask';
import { GetCompanyByTaxNumberAndCompanyRelated, insertCompany } from '../services/api';
import { useDispatch } from 'react-redux';
import { setExistingCompanyData } from '../reducers/companySlice';
import { toast } from 'react-toastify';

interface CompanyData {
  name: string;
  tradeName: string;
  taxNumber: string;
  cep: string;
  street: string;
  propertyNumber: string;
  district: string;
  city: string;
  state: string;
  country: string;
  addressComplement: string;
  phoneNumber: string;
  email: string;
  observations: string;
}

const Companies: React.FC = () => {
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    tradeName: '',
    taxNumber: '',
    cep: '',
    street: '',
    propertyNumber: '',
    district: '',
    city: '',
    state: '',
    country: 'Brasil',
    addressComplement: '',
    phoneNumber: '',
    email: '',
    observations: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = (data: CompanyData) => {
    const { name, tradeName, taxNumber, cep, street, propertyNumber, district, city, state, country, phoneNumber, email } = data;
    return !!(name && tradeName && taxNumber && cep && street && propertyNumber && district && city && state && country && phoneNumber && email);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    let newValue = value;
    switch (name) {
      case 'taxNumber':
        newValue = formatCNPJandCPF(value);
        break;
      case 'phoneNumber':
        newValue = formatPhoneNumber(value);
        break;
      case 'cep':
        newValue = formatCEPNumber(value);
        break;
      default:
        newValue = value;
    }
    setCompanyData(prevState => {
      const updatedData = { ...prevState, [name]: newValue };
      setIsFormValid(validateForm(updatedData));
      return updatedData;
    });
  };

  useEffect(() => {
    if (companyData.taxNumber.replace(/\D/g, '').length === 14 || companyData.taxNumber.replace(/\D/g, '').length === 11) {
      checkCompanyExists(companyData.taxNumber);
    }
  }, [companyData.taxNumber]);

  const checkCompanyExists = async (taxNumber: string) => {
    setLoading(true);
    setShowLoadingScreen(true);

    try {
      const company = JSON.parse(localStorage.getItem('company') || '{}');
      const companyRelated = company.id;
      console.log(companyRelated)
      const startTime = Date.now();
      const response = await GetCompanyByTaxNumberAndCompanyRelated(taxNumber.replace(/\D/g, ''), companyRelated );
      const elapsedTime = Date.now() - startTime;
      const remainingTime = 800 - elapsedTime;

      if (response) {
        setTimeout(() => {
          dispatch(setExistingCompanyData(response));
          setShowLoadingScreen(false);
          navigate('/update-company');
          toast.success('Cliente já está cadastrado.');
        }, remainingTime > 0 ? remainingTime : 0);
      } else {
        setTimeout(() => {
          setShowLoadingScreen(false);
        }, remainingTime > 0 ? remainingTime : 0);
      }
    } catch (error) {
      console.log('Cliente não encontrado.');
      setShowLoadingScreen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.warn('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);

    try {
      const company = JSON.parse(localStorage.getItem('company') || '{}');
      const companyRelated = company.id;
      
      await insertCompany({ ...companyData, companyRelated });
      toast.success('Empresa registrada com sucesso!');
      setCompanyData({
        name: '',
        tradeName: '',
        taxNumber: '',
        cep: '',
        street: '',
        propertyNumber: '',
        district: '',
        city: '',
        state: '',
        country: 'Brasil',
        addressComplement: '',
        phoneNumber: '',
        email: '',
        observations: '',
      });
      setIsFormValid(false);
    } catch (error) {
      toast.error('Erro ao registrar a empresa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Box mt={10}>
          <Typography variant="h4" component="h1" gutterBottom>
            Cadastro de Clientes
          </Typography>
          {showLoadingScreen && (
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
                  label="CNPJ OU CPF"
                  name="taxNumber"
                  placeholder="CNPJ XX.XXX.XXX/XXXX-XX OU CPF XXX.XXX.XXX-XX"
                  value={companyData.taxNumber}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome do Cliente"
                  name="name"
                  value={companyData.name}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome Fantasia"
                  name="tradeName"
                  value={companyData.tradeName}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="phoneNumber"
                  value={companyData.phoneNumber}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={companyData.email}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CEP"
                  name="cep"
                  value={companyData.cep}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Rua"
                  name="street"
                  value={companyData.street}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número"
                  name="propertyNumber"
                  value={companyData.propertyNumber}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Complemento"
                  name="addressComplement"
                  value={companyData.addressComplement}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bairro"
                  name="district"
                  value={companyData.district}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cidade"
                  name="city"
                  value={companyData.city}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estado"
                  name="state"
                  value={companyData.state}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="País"
                  name="country"
                  value={companyData.country}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observações"
                  name="observations"
                  value={companyData.observations}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!isFormValid || loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Registrar Empresa'}
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

export default Companies;
