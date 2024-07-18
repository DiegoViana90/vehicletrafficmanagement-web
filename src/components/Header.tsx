import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled, Theme } from '@mui/material/styles';

const CustomAppBar = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const Header: React.FC = () => {
  return (
    <CustomAppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" noWrap>
          Vehicle Traffic Management
        </Typography>
      </Toolbar>
    </CustomAppBar>
  );
};

export default Header;
