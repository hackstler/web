// src/pages/Contact.js
import React from 'react'
import { Typography, Box, Link } from '@mui/material'

const Contact = () => {
  return (
    <Box
      sx={{
        height: '100vh', // Ajuste para ocupar toda la altura de la ventana gráfica
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Centrar contenido verticalmente
        backgroundImage: `url(/fondo.png)`,
        //   backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center'
      }}
    >
      <Typography variant="h4" gutterBottom>
        Contacto
      </Typography>
      <Typography variant="body1" paragraph>
        ¿Interesado en colaborar o simplemente quieres charlar sobre tecnología
        y desarrollo? No dudes en ponerte en contacto.
      </Typography>
      <Link href="mailto:sergiop.pias@gmail.com" variant="body1">
        sergiop.pias@gmail.com
      </Link>
      <Typography variant="body1" paragraph sx={{ mt: 2 }}>
        También puedes encontr
        <Link
          href="https://linkedin.com/in/sergio-pérez-developer"
          target="_blank"
          rel="noopener"
          variant="body1"
        >
          LinkedIn: sergio-pérez-developer
        </Link>
      </Typography>
    </Box>
  )
}

export default Contact
