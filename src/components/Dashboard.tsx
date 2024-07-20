// Dashboard.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './Layout';  // Importe o Layout

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useSelector((state: any) => state.auth);
    const company = JSON.parse(localStorage.getItem('company') || '{}');
    const tradeName = company.tradeName || 'Empresa';

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    return (
        <Layout>
            <main className="main-content">
                <h1>Bem-vindo à {tradeName}</h1>
                <h3>Sistema de Gerenciamento de veículos</h3>
            </main>
        </Layout>
    );
};

export default Dashboard;
