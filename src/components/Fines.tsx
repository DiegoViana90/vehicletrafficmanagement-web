import React from 'react';
import Layout from './Layout';

const Fines: React.FC = () => {
    const company = JSON.parse(localStorage.getItem('company') || '{}');
    const tradeName = company.tradeName || 'Empresa';

    return (
        <Layout>
            <main className="main-content">
                <h1>MULTAS </h1>
                <h3>MULTAS</h3>
            </main>
        </Layout>
    );
};

export default Fines;
