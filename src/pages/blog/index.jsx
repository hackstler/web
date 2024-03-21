// src/pages/Blog.js
import React from 'react'
import { Grid, Paper, Typography, Box } from '@mui/material'

// Simulación de entradas de blog, reemplázalas con tu contenido real
const blogPosts = [
  {
    title: 'El Futuro de la Tecnología',
    content:
      'La tecnología está en constante evolución, y con ella, nuestra forma de interactuar con el mundo...'
  },
  {
    title: 'Seguridad en el Desarrollo de Software',
    content:
      'La seguridad es un aspecto crítico en el desarrollo de software. Aquí te comparto algunos consejos...'
  }
  // Añade más posts según sea necesario
]

const Blog = () => {
  return (
    <Box sx={{ flexGrow: 1, m: 3 }}>
      <Grid container spacing={2}>
        {blogPosts.map((post, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h5" component="h3">
                {post.title}
              </Typography>
              <Typography component="p">{post.content}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Blog
