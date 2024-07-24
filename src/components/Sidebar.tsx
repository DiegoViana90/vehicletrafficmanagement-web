import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import FuelIcon from '@mui/icons-material/LocalGasStation';
import TrafficIcon from '@mui/icons-material/Traffic';
import DriverIcon from '@mui/icons-material/Person'; 
import FineIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description'; 
import BusinessIcon from '@mui/icons-material/Business'; 
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface NavigationItem {
  text: string;
  icon: JSX.Element | null;
  path: string;
}

const drawerWidth = 280;

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated || !isDesktop) {
        return null;
    }

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const items: NavigationItem[] = [
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
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    zIndex: 1, 
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar />
            <List>
                {items.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton onClick={() => handleNavigation(item.path)}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
