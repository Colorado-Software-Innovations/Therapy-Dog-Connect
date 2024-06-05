import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function CopyRight(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://therapydogconnect.com/">
        Therapy Dog Connect
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default CopyRight;
