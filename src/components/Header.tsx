import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { logout as logoutAction } from '../actions/authActions';
import FuelIcon from '@mui/icons-material/LocalGasStation';
import TrafficIcon from '@mui/icons-material/Traffic';
import DriverIcon from '@mui/icons-material/Person'; 
import FineIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description'; 
import BusinessIcon from '@mui/icons-material/Business'; 
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const company = JSON.parse(localStorage.getItem('company') || '{}');
  const tradeName = company.tradeName || 'Empresa';

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    navigate('/login');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const drawerWidth = 240;

  const items = [
    { text: 'Gerenciamento', icon: null, path: '/dashboard' },
    { text: 'Tráfego', icon: <TrafficIcon />, path: '/vehicletraffic' }, 
    { text: 'Combustível', icon: <FuelIcon />, path: '/fuel' },  
    { text: 'Motoristas', icon: <DriverIcon />, path: '/drivers' },
    { text: 'Multas', icon: <FineIcon />, path: '/fines' }, 
    { text: 'Contratos', icon: <DescriptionIcon />, path: '/contracts' }, 
    { text: 'Clientes', icon: <BusinessIcon />, path: '/Companies' }, 
    { text: 'Veículos', icon: <DirectionsCarIcon />, path: '/vehicles' },
  ];

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
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
      </AppBar>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
          {items.map((item) => (
            <ListItem key={item.text} button onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Header;
