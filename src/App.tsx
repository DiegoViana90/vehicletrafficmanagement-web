import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChangePassword from './components/ChangePassword';
import { RootState } from './store'; // Corrigido para o caminho correto do seu arquivo de store

const ProtectedRoute: React.FC<{ condition: boolean; redirectTo: string; children: React.ReactElement }> = ({ condition, redirectTo, children }) => {
    return condition ? children : <Navigate to={redirectTo} />;
};

const App: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const isFirstAccess = user?.isFirstAccess;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute condition={!isFirstAccess} redirectTo="/change-password">
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/change-password" 
                    element={
                        <ProtectedRoute condition={isFirstAccess} redirectTo="/dashboard">
                            <ChangePassword />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
