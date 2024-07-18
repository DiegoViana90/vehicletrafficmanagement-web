import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChangePassword from './components/ChangePassword';

const Rotas: React.FC = () => {
    // Função para verificar o acesso à página de mudança de senha
    const checkAccess = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.isFirstAccess;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route 
                    path="/change-password" 
                    element={
                        checkAccess() 
                        ? <ChangePassword /> 
                        : <Navigate to="/login" />
                    } 
                />
                {/* Outras rotas conforme necessário */}
            </Routes>
        </BrowserRouter>
    );
};

export default Rotas;
