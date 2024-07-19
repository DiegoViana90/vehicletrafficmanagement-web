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
            <div style={{ flexGrow: 1, marginLeft: 240 }}>
                <Header />
                <main style={{ marginTop: 30, padding: 500 }}>
                    {/* Conteúdo do dashboard aqui */}
                    <h2>Bem-vindo ao Dashboard!</h2>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
