import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import PasswordIcon from '@mui/icons-material/Password';
import Typography from '@mui/material/Typography';
import Copyright from '../UI/CopyRight';

const ConfirmCode = ({ handleConfirmationCode }) => {
  const [confirmCode, setConfirmCode] = useState('');

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <PasswordIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        We sent you a code to your email. Please confirm below.
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={(e) => handleConfirmationCode(e, confirmCode)}
        sx={{ mt: 1 }}
      >
        <TextField
          onChange={(e) => setConfirmCode(e.target.value)}
          margin="normal"
          required
          fullWidth
          name="code"
          label="Code"
          type="number"
          id="code"
        />

        <Button
          onSubmit={(e) => handleConfirmationCode(e, confirmCode)}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Confirm
        </Button>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </Box>
  );
};

export default ConfirmCode;
