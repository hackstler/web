// src/theme.js
import { createTheme } from '@mui/material/styles'
import { purple, blue, cyan, amber } from '@mui/material/colors'
import backgroundImage from './assets/fondo.png'

const theme = createTheme({
  palette: {
    primary: purple,
    secondary: blue,
    error: cyan,
    warning: amber
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${backgroundImage})`,
          backgroundAttachment: 'fixed' // This will make the background fixed during scroll
        }
      }
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#FFF'
    }
    // ... puedes añadir más personalizaciones aquí
  }
})

export default theme
