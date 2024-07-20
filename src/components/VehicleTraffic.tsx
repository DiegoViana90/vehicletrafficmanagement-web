import React from 'react';
import Layout from './Layout';

const VehicleTraffic: React.FC = () => {
    const companyJson = localStorage.getItem('company');
    const company = companyJson ? JSON.parse(companyJson) : {};
    const tradeName = company.tradeName || 'Empresa não especificada'; 

    return (
        <Layout>
            <main className="main-content">
                <h1>Tráfego de Veículos</h1>
                <h3>Gerenciamento de tráfego</h3>
                <p>Em Construção</p>
            </main>
        </Layout>
    );
};

export default VehicleTraffic;
