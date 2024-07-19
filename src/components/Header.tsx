import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import { logout as logoutAction } from '../actions/authActions';

const CustomAppBar = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Recupera informações da empresa do armazenamento local
  const company = JSON.parse(localStorage.getItem('company') || '{}');
  const tradeName = company.tradeName || 'Empresa';

  const handleLogout = () => {
    // Limpar o estado de autenticação
    dispatch(logoutAction());

    // Limpar o armazenamento local
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('company');

    // Redirecionar para a tela de login
    navigate('/login');
  };

  return (
    <CustomAppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Gerenciamento de Frota de Veículos
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
          <Typography variant="subtitle1" noWrap>
            Empresa: {tradeName}
          </Typography>
          <Button color="inherit" onClick={handleLogout} sx={{ marginLeft: '16px' }}>
            SAIR
          </Button>
        </Box>
      </Toolbar>
    </CustomAppBar>
  );
};

export default Header;
