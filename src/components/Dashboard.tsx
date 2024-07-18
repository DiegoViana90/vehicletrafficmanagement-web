// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanyById } from '../services/api'; // Importe a função específica
import Sidebar from './Sidebar'; // Importe o componente Sidebar
import './styles.css';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user')!);
                const token = localStorage.getItem('token')!;
                
                if (!user || !token) {
                    console.error('Usuário ou token não encontrados no localStorage');
                    navigate('/login');
                    return;
                }

                if (user.isFirstAccess) {
                    navigate('/change-password'); // Redireciona para ChangePassword se for o primeiro acesso
                    return;
                }

                console.log(`Tentando obter dados da empresa para ID: ${user.companiesId}`);
                const company = await getCompanyById(user.companiesId, token);
                if (!company || !company.tradeName) {
                    throw new Error('Dados da empresa não encontrados ou incompletos');
                }

                setUserName(company.tradeName);
                console.log(`Seja bem-vindo, ${company.tradeName}!`);
            } catch (error) {
                console.error('Erro ao obter dados da empresa:', error);
                alert('Erro ao obter dados da empresa. Verifique sua conexão.');
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    return (
        <div className="dashboard">
            <Sidebar /> {/* Sidebar à esquerda */}
            <div className="dashboard-content">
                <header className="dashboard-header">
                    <h2>Bem-vindo, {userName}</h2>
                </header>
                <main className="dashboard-main">
                    {/* Renderize outros componentes aqui */}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
