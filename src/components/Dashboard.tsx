import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Header from './Header';
import './styles.css';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useSelector((state: any) => state.auth);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div className="dashboard">
                <Header />
                <div className="dashboard-content">
                    <main className="dashboard-main">
                        {/* Conteúdo do dashboard aqui */}
                        <h2>Bem-vindo ao Dashboard!</h2>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
