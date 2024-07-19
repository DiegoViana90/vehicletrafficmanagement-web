import React from 'react';
import Layout from './Layout';

const VehicleTraffic: React.FC = () => {
    const companyJson = localStorage.getItem('company');
    const company = companyJson ? JSON.parse(companyJson) : {};
    const tradeName = company.tradeName || 'Empresa não especificada'; 

    return (
        <Layout>
            <main className="dashboard-main">
                <h1>Gerenciamento de Tráfego de Veículos - {tradeName}</h1>
                <h3>Explore a eficiência e segurança do tráfego de seus veículos.</h3>
                <p>Em Construção</p>
            </main>
        </Layout>
    );
};

export default VehicleTraffic;
