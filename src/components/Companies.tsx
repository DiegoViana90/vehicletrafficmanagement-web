import React from 'react';
import Layout from './Layout';

const Companies: React.FC = () => {
    const company = JSON.parse(localStorage.getItem('company') || '{}');
    const tradeName = company.tradeName || 'Empresa';

    return (
        <Layout>
            <main className="dashboard-main">
                <h1>Empresas </h1>
                <h3>Empresas</h3>
            </main>
        </Layout>
    );
};

export default Companies;
