import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <Drawer variant="permanent">
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/recebimentos">
          <ListItemText primary="Recebimentos" />
        </ListItem>
        <ListItem button component={Link} to="/cadastros">
          <ListItemText primary="Cadastros" />
        </ListItem>
        {/* Adicione outros itens conforme necessário */}
      </List>
    </Drawer>
  );
};

export default Sidebar;
