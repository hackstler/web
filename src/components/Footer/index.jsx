// En tu componente Footer.js
import React from 'react';
import { Box, Container, Typography, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
          Hackstler
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Construyendo el futuro con tecnología e innovación.
        </Typography>
        <Box mt={2} align="center">
          <IconButton aria-label="Twitter" color="inherit">
            <TwitterIcon />
          </IconButton>
          <IconButton aria-label="LinkedIn" color="inherit">
            <LinkedInIcon />
          </IconButton>
          <IconButton aria-label="Instagram" color="inherit">
            <InstagramIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
