import React, { useState } from 'react';
import Layout from './Layout';
import { formatCEPNumber, formatCNPJandCPF, formatPhoneNumber } from '../mask/mask';

interface UpdateCompanyProps {
    initialData: {
        cnpjCpf: string;
        name: string;
        tradeName: string;
        phoneNumber: string;
        email: string;
        cep: string;
        street: string;
        propertyNumber: string;
        addressComplement: string;
        district: string;
        city: string;
        state: string;
        country: string;
        observations: string;
    };
}

const UpdateCompany: React.FC<UpdateCompanyProps> = ({ initialData }) => {
    const [companyData, setCompanyData] = useState(initialData);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        let newValue = value;
        switch (name) {
            case 'cnpjCpf':
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
            [name]: newValue
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Atualizar Dados da Empresa:", companyData);
    };

    return (
        <Layout>
            <main className="companies-content">
                <h1>Atualização de Clientes</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="cnpjCpf" placeholder="CNPJ XX.XXX.XXX/XXXX-XX OU CPF XXX.XXX.XXX-XX" value={companyData.cnpjCpf} onChange={handleChange} className="companies-input" />
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
                    <button type="submit" className="submit-button">Atualizar Empresa</button>
                </form>
            </main>
        </Layout>
    );
};

export default UpdateCompany;
