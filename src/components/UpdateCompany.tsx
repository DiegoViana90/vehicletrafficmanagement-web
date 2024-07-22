import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Box, Typography, CircularProgress, Grid } from '@mui/material';
import Layout from './Layout';
import { formatCEPNumber, formatCNPJandCPF, formatPhoneNumber } from '../mask/mask';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateCompany } from '../services/api';
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

const UpdateCompany: React.FC = () => {
  const existingCompanyData = useSelector((state: RootState) => state.company.existingCompanyData) as CompanyData | null;

  const formatCompanyData = (data: CompanyData | null): CompanyData => {
    if (!data) {
      return {
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
      };
    }
    return {
      ...data,
      taxNumber: formatCNPJandCPF(data.taxNumber),
      phoneNumber: formatPhoneNumber(data.phoneNumber),
      cep: formatCEPNumber(data.cep),
    };
  };

  const [companyData, setCompanyData] = useState<CompanyData>(formatCompanyData(existingCompanyData));
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (existingCompanyData) {
      setCompanyData(formatCompanyData(existingCompanyData));
    }
  }, [existingCompanyData]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.warn('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      await updateCompany(companyData);
      toast.success('Empresa atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar a empresa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Box mt={10}>
          <Typography variant="h4" component="h1" gutterBottom>
            Atualização de Clientes
          </Typography>
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            </Box>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CNPJ OU CPF"
                  name="taxNumber"
                  placeholder="CNPJ XX.XXX.XXX/XXXX-XX OU CPF XXX.XXX.XXX-XX"
                  value={companyData.taxNumber}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                  style={{ backgroundColor: '#f0f0f0' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nome do Cliente"
                  name="name"
                  value={companyData.name}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                  style={{ backgroundColor: '#f0f0f0' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nome Fantasia"
                  name="tradeName"
                  value={companyData.tradeName}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="phoneNumber"
                  value={companyData.phoneNumber}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
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
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CEP"
                  name="cep"
                  value={companyData.cep}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Rua"
                  name="street"
                  value={companyData.street}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Número"
                  name="propertyNumber"
                  value={companyData.propertyNumber}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Complemento"
                  name="addressComplement"
                  value={companyData.addressComplement}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Bairro"
                  name="district"
                  value={companyData.district}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Cidade"
                  name="city"
                  value={companyData.city}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Estado"
                  name="state"
                  value={companyData.state}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
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
                    {loading ? <CircularProgress size={24} /> : 'ATUALIZAR Empresa'}
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

export default UpdateCompany;
