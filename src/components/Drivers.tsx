import React from 'react';
import Layout from './Layout';

const Drivers: React.FC = () => {
    const company = JSON.parse(localStorage.getItem('company') || '{}');
    const tradeName = company.tradeName || 'Empresa';

    return (
        <Layout>
            <main className="dashboard-main">
                <h1>Motoristas {tradeName}</h1>
                <h3>Motoca</h3>
            </main>
        </Layout>
    );
};

export default Drivers;
