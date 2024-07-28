import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../actions/authActions';
import { login, getCompanyById } from '../services/api';
import './styles.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        localStorage.clear();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await login(email, password);
            const { token, userId, isFirstAccess, fullName, companiesId } = response;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({
                id: userId,
                isFirstAccess,
                fullName,
                companiesId
            }));

            if (companiesId) {
                const companyResponse = await getCompanyById(companiesId, token);
                localStorage.setItem('company', JSON.stringify(companyResponse));
                alert(`Seja bem-vindo, ${fullName}, da empresa ${companyResponse.tradeName}!`);
            } else {
                localStorage.removeItem('company');
                alert(`Seja bem-vindo, ${fullName}!`);
            }

            if (isFirstAccess) {
                dispatch(loginAction({ token, user: response }));
                navigate('/change-password');
            } else {
                dispatch(loginAction({ token, user: response }));
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Login falhou:', error);

            let errorMessage = 'Ocorreu um erro desconhecido.';
            if (error.response) {
                errorMessage = error.response.data.Message || errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Entrar no Sistema</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="login-input"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        required
                        className="login-input"
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
