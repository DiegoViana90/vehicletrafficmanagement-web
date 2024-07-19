import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { changePassword } from '../services/api';
import { logout } from '../actions/authActions';
import './styles.css';

const ChangePassword: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.isFirstAccess) {
            navigate('/login');
        }
    }, [navigate]);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }

        try {
            setLoading(true);

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user || !user.id) {
                throw new Error('Usuário não encontrado no localStorage.');
            }

            const userId = Number(user.id);

            await changePassword({
                userId: userId,
                randomPassword: currentPassword,
                newPassword: newPassword
            });

            alert('Senha alterada com sucesso!');
            const updatedUser = { ...user, isFirstAccess: false };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Limpar o estado global e redirecionar para a tela de login
            dispatch(logout());
            navigate('/login');
        } catch (error: any) {
            console.error('Alteração de senha falhou:', error);

            if (error.response) {
                if (error.response.data) {
                    alert(`Erro: ${error.response.data}`);
                } else {
                    alert(`Erro: ${error.response.status} - ${error.response.statusText}`);
                }
            } else {
                alert('Alteração de senha falhou, tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Alterar senha temporária</h2>
                <form onSubmit={handleChangePassword}>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Senha Atual"
                        required
                        className="input"
                    />
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nova Senha"
                        required
                        className="input"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar Nova Senha"
                        required
                        className="input"
                    />
                    <button type="submit" className="button-login" disabled={loading}>
                        {loading ? 'Carregando...' : 'Alterar Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
