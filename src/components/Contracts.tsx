import React from 'react';
import Layout from './Layout';

const Contracts: React.FC = () => {
    const company = JSON.parse(localStorage.getItem('company') || '{}');
    const tradeName = company.tradeName || 'Empresa';

    return (
        <Layout>
            <main className="main-content">
                <h1>Contracts </h1>
                <h3>Contracts</h3>
            </main>
        </Layout>
    );
};

export default Contracts;
