import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { formatCEPNumber, formatCNPJandCPF, formatPhoneNumber } from '../mask/mask';
import { getCompanyByTaxNumber } from '../services/api';
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    setCompanyData({
      ...companyData,
      [name]: newValue,
    });
  };

  useEffect(() => {
    if (companyData.taxNumber.replace(/\D/g, '').length === 14 || companyData.taxNumber.replace(/\D/g, '').length === 11) {
      checkCompanyExists(companyData.taxNumber);
    }
  }, [companyData.taxNumber]);

  const checkCompanyExists = async (taxNumber: string) => {
    setLoading(true);
    setShowLoadingScreen(true); // Show loading screen

    try {
      const startTime = Date.now();
      const response = await getCompanyByTaxNumber(taxNumber.replace(/\D/g, ''));
      const elapsedTime = Date.now() - startTime;
      const remainingTime = 1000 - elapsedTime; // Ensure the loading screen shows for at least 1 second

      if (response) {
        setTimeout(() => {
          dispatch(setExistingCompanyData(response));
          setShowLoadingScreen(false); // Hide loading screen
          navigate('/update-company');
          toast.success('Cliente já está cadastrado.');
        }, remainingTime > 0 ? remainingTime : 0);
      } else {
        setTimeout(() => {
          setShowLoadingScreen(false); // Hide loading screen
        }, remainingTime > 0 ? remainingTime : 0);
      }
    } catch (error) {
      console.log('Cliente não encontrado.');
      setShowLoadingScreen(false); // Hide loading screen on error
      toast.error('Cliente não encontrado.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Dados da Empresa:', companyData);
  };

  return (
    <Layout>
      <main className="companies-content">
        {showLoadingScreen && (
          <div className="loading-overlay">
            <div className="loading-message">Carregando...</div>
          </div>
        )}
        <h1>Cadastro de Clientes</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="taxNumber" placeholder="CNPJ XX.XXX.XXX/XXXX-XX OU CPF XXX.XXX.XXX-XX" value={companyData.taxNumber} onChange={handleChange} className="companies-input" />
          <input type="text" name="name" placeholder="Nome do Cliente" maxLength={60} value={companyData.name} onChange={handleChange} className="companies-input" />
          <input type="text" name="tradeName" placeholder="Nome Fantasia" maxLength={50} value={companyData.tradeName} onChange={handleChange} className="companies-input" />
          <input type="text" name="phoneNumber" placeholder="Telefone (XX)XXXXX-XXXX" value={companyData.phoneNumber} onChange={handleChange} className="companies-input" />
          <input type="email" name="email" placeholder="Email" maxLength={50} value={companyData.email} onChange={handleChange} className="companies-input" />
          <input type="text" name="cep" placeholder="CEP" value={companyData.cep} onChange={handleChange} className="companies-input" />
          <input type="text" name="street" placeholder="Rua" maxLength={50} value={companyData.street} onChange={handleChange} className="companies-input" />
          <input type="text" name="propertyNumber" placeholder="Número" maxLength={10} value={companyData.propertyNumber} onChange={handleChange} className="companies-input" />
          <input type="text" name="addressComplement" placeholder="Complemento" maxLength={30} value={companyData.addressComplement} onChange={handleChange} className="companies-input" />
          <input type="text" name="district" placeholder="Bairro" maxLength={30} value={companyData.district} onChange={handleChange} className="companies-input" />
          <input type="text" name="city" placeholder="Cidade" maxLength={30} value={companyData.city} onChange={handleChange} className="companies-input" />
          <input type="text" name="state" placeholder="Estado" maxLength={30} value={companyData.state} onChange={handleChange} className="companies-input" />
          <input type="text" name="country" placeholder="País" maxLength={30} value={companyData.country} onChange={handleChange} className="companies-input" />
          <textarea name="observations" placeholder="Observações" maxLength={100} value={companyData.observations} onChange={handleChange} className="companies-input"></textarea>
          <button type="submit" className="submit-button">Registrar Empresa</button>
        </form>
      </main>
    </Layout>
  );
};

export default Companies;
