import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'

const useTypewriterEffect = (text, speed, delay) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timer

    // Decide la acción basada en si actualmente está borrando o no
    if (isDeleting) {
      if (displayedText.length === 0) {
        setIsDeleting(false) // Cambia a agregar texto
        timer = setTimeout(() => {}, delay) // Espera antes de empezar a añadir texto nuevamente
      } else {
        timer = setTimeout(() => {
          // Borra el último carácter
          setDisplayedText(currentText => currentText.slice(0, -1))
        }, speed)
      }
    } else {
      if (displayedText.length === text.length) {
        timer = setTimeout(() => {
          setIsDeleting(true) // Cambia a borrar texto
        }, delay) // Espera antes de empezar a borrar
      } else {
        timer = setTimeout(() => {
          // Añade el siguiente carácter
          setDisplayedText(
            currentText => currentText + text[displayedText.length]
          )
        }, speed)
      }
    }

    // Limpieza
    return () => clearTimeout(timer)
  }, [displayedText, isDeleting, text, speed, delay])

  return displayedText
}

const WelcomeText = ({ text = 'default', speed = 150, delay = 2000 }) => {
  const animatedText = useTypewriterEffect(text, speed, delay)

  return (
    <Box
      sx={{
        fontFamily: 'monospace',
        fontSize: '1.5rem',
        whiteSpace: 'pre',
        color: 'rgb(0, 255, 0)', // Un verde neón vibrante
        textShadow: '0 0 8px rgba(0, 255, 0, 0.8)' // Un suave resplandor para mejorar la legibilidad
      }}
    >
      {animatedText}
    </Box>
  )
}
WelcomeText.propTypes = {
  text: PropTypes.string.isRequired, // Define 'text' como un string requerido
  speed: PropTypes.number, // Define 'speed' como un número (no requerido)
  delay: PropTypes.number // Define 'delay' como un número (no requerido)
}
export default WelcomeText
