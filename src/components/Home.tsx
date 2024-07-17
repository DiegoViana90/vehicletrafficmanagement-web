import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Home: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo à sua aplicação!
      </Typography>
      <Typography paragraph>
        Esta é a tela inicial da sua aplicação. Você pode personalizar este componente
        conforme necessário para exibir informações importantes ou funcionalidades
        principais da sua aplicação.
      </Typography>
      <Typography paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </Typography>
    </Box>
  );
}

export default Home;
