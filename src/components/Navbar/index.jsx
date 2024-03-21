// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
// Importa el componente Link de react-router-dom
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="absolute" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="h6" color="inherit" noWrap>
        </Typography>
        <div>
          {/* Envuelve tus botones en componentes Link y asigna la prop "to" con la ruta deseada */}
          <Link to="/career" style={{ textDecoration: 'none' }}>
            <Button color="inherit" sx={{ marginRight: 1, color:'white' }}>Carrera</Button>
          </Link>
          <Link to="/story" style={{ textDecoration: 'none' }}>
            <Button color="inherit" sx={{ marginRight: 1, color:'white' }}>Historia</Button>
          </Link>
          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <Button color="inherit" sx={{ marginRight: 1, color:'white' }}>Contacto</Button>
          </Link>
          <Link to="/blog" style={{ textDecoration: 'none' }}>
            <Button color="inherit" sx={{ marginRight: 1, color:'white' }}>Blog</Button>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
