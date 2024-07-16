import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import './App.css';

const App: React.FC = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated'); // Verifica se o usuário está autenticado

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Sidebar />} {/* Renderiza a Sidebar apenas se autenticado */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Adicione outras rotas para módulos aqui */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
