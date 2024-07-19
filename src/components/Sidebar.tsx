import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FuelIcon from '@mui/icons-material/LocalGasStation'; // Ícone de combustível
import TrafficIcon from '@mui/icons-material/Traffic'; // Ícone de tráfego
import DriverIcon from '@mui/icons-material/Person'; // Ícone de motorista
import FineIcon from '@mui/icons-material/AttachMoney'; // Exemplo de ícone para multas
import Toolbar from '@mui/material/Toolbar';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
        return null;
    }

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
                {[
                    { text: 'Gerenciamento', icon: null },
                    { text: 'Tráfego', icon: <TrafficIcon /> },
                    { text: 'Combustível', icon: <FuelIcon /> },
                    { text: 'Motoristas', icon: <DriverIcon /> },
                    { text: 'Multas', icon: <FineIcon /> },
                ].map((item, index) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton>
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
