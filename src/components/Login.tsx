import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getCompanyById } from '../services/api'; // Importe as funções login e getCompanyById do arquivo api.tsx
import './styles.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            setLoading(true);
    
            const response = await login(email, password); 
            const { token, companiesId, company, isFirstAccess, fullName, userId } = response;
    
            console.log(response);
    
            // Armazene o token e o usuário no localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({
                id: Number(userId), // Garanta que é um número
                companiesId,
                company,
                isFirstAccess,
                fullName
            }));
    
            let companyName = fullName; // Default to fullName if company is null
            if (companiesId) {
                console.log('entrei na validação do companiesId ele tem um Id');
                const companyResponse = await getCompanyById(companiesId, token);
                localStorage.setItem('company', JSON.stringify(companyResponse));
                companyName = companyResponse.tradeName;
            }
    
            alert(`Seja bem-vindo, ${fullName}${companyName ? `, da empresa ${companyName}` : ''}!`);
    
            if (isFirstAccess) {
                navigate('/change-password');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login falhou:', error);
            alert('Login Falhou, Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <div className="container">
            <div className="card">
                <h2>Login Suporte</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="input"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        required
                        className="input"
                    />
                    <button type="submit" className="button-login" disabled={loading}>
                        {loading ? 'Carregando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
