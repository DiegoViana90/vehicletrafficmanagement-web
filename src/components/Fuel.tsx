import React from 'react';
import Layout from './Layout';

const Fuel: React.FC = () => {
    const company = JSON.parse(localStorage.getItem('company') || '{}');
    const tradeName = company.tradeName || 'Empresa';

    return (
        <Layout>
            <main className="dashboard-main">
                <h1>COMBUSTIVEL</h1>
                <h3>COMBUSTIVEL</h3>
            </main>
        </Layout>
    );
};

export default Fuel;
