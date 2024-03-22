// src/pages/Home.js
import React from 'react'
import { Box, Typography, Container } from '@mui/material'
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
// import SearchIcon from '@mui/icons-material/Search'
import WelcomeText from '../../components/Animations/WelcomeText'

const Home = () => {
  return (
    <Box
      sx={{
        height: '100vh', // Ajuste para ocupar toda la altura de la ventana gráfica
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Centrar contenido verticalmente
        color: 'white',
        textAlign: 'center'
      }}
    >
      <Container maxWidth="lg">
        <WelcomeText text="< Wellcome To: />" speed={150} delay={2000} />
        <Typography variant="h1" gutterBottom sx={{ margin: '20px 0' }}>
          {' '}
          {/* Ajuste del margen */}
          HACKSTLER COMMUNITY
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            margin: '20px 0',
            color: 'rgb(0, 255, 0)', // Un verde neón vibrante
            textShadow: '0 0 8px rgba(0, 255, 0, 0.8)' // Un suave resplandor para mejorar la legibilidad
          }}
        >
          {' '}
          {/* Ajuste del margen */}
          Crafting Innovators, Disrupting Norms
        </Typography>
        {/* <Button variant="outlined" color="secondary" sx={{ margin: '20px auto', display: 'block' }}>
          ADD TO FAVORITES
        </Button> */}
        {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '20px' }}>
          <IconButton sx={{ color: 'white', marginRight: '10px' }}>
            <SearchIcon />
          </IconButton>
          <IconButton sx={{ color: 'white' }}>
            <FavoriteBorderIcon />
          </IconButton>
        </Box> */}
      </Container>
    </Box>
  )
}

export default Home
