import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/api';
import './styles.css';

const ChangePassword: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

            const response = await changePassword({
                userId: userId,
                randomPassword: currentPassword,
                newPassword: newPassword
            });

            if (response.status === 200) {
                alert('Senha alterada com sucesso!');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Alteração de senha falhou:', error);
            alert('Alteração de senha falhou, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Alterar Senha</h2>
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
