// src/App.js
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
// import Navbar from './components/Navbar'
import Home from './pages/Home'
// import Story from './pages/Story'
// import Blog from './pages/blog'
// import Contact from './pages/Contact'
import theme from './theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Inyecta los estilos de fondo en tu aplicación */}
      <Router>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/*" element={<Home />} />
          {/* <Route path="/story" element={<Story />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
