// src/pages/Story.js
import React from 'react'
import { Container, Typography, Box } from '@mui/material'

const Story = () => {
  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Mi Historia
        </Typography>
        <Typography variant="body1" paragraph>
          Desde pequeño, he tenido una fascinación por la tecnología y la
          innovación. Mi viaje comenzó en los vibrantes barrios de mi ciudad
          natal, donde aprendí el valor de la adaptabilidad y la resiliencia.
        </Typography>
        <Typography variant="body1" paragraph>
          A lo largo de mi carrera, he trabajado en varios roles que me han
          permitido moldear y afinar mis habilidades. En Telefónica, desarrollé
          y mantuve herramientas críticas para el área de antifraude, lo que me
          permitió entender la importancia de la seguridad y la eficiencia en el
          desarrollo de software.
        </Typography>
        <Typography variant="body1" paragraph>
          En Rookiewise y Avoris, me sumergí en el mundo de las reservas de
          viajes, trabajando en la migración, implementación y despliegue de
          sistemas complejos. Esta experiencia fue crucial para entender las
          necesidades del negocio y cómo la tecnología puede ser una solución.
        </Typography>
        <Typography variant="body1" paragraph>
          Mi paso por Demium Startups y SQAAS me enseñó el valor de la
          innovación constante y cómo la tecnología puede transformar cualquier
          industria.
        </Typography>
        <Typography variant="body1" paragraph>
          Hoy, sigo aprendiendo y creciendo cada día, comprometido a usar mi
          conocimiento y experiencia para crear soluciones tecnológicas que
          hagan una diferencia.
        </Typography>
      </Box>
    </Container>
  )
}

export default Story
