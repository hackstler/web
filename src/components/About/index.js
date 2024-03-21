// src/components/HeroSection.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const About = () => {

  return (
    <Box
      sx={{
        position: 'relative',
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        color: 'white',
        // Puedes agregar aquí el gradiente o imagen de fondo
        background: 'linear-gradient(180deg, rgba(76, 76, 216, 0.7) 0%, rgba(103, 58, 183, 0.7) 100%)',
        // Añade aquí la imagen de fondo como una propiedad de estilo si es necesario
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
        Three.js in React Part 1
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        Bring your website to life with beautiful 3D objects
      </Typography>
      <Button variant="contained" color="secondary">
        Add to Favorites
      </Button>
      {/* Aquí iría cualquier gráfico o animación adicional */}
    </Box>
  );
};

export default About;
