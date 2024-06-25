import React, { useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import PasswordIcon from '@mui/icons-material/Password';
import Typography from '@mui/material/Typography';
import Copyright from '../UI/CopyRight';

const ConfirmCode = ({ handleConfirmationCode }) => {
  const [confirmCode, setConfirmCode] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      const newCode = [...confirmCode];
      newCode[index] = value;
      setConfirmCode(newCode);

      if (value !== '' && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = confirmCode.join('');
    handleConfirmationCode(e, code);
  };

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
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {confirmCode.map((_, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              value={confirmCode[index]}
              margin="normal"
              required
              name={`code-${index}`}
              label=""
              type="text"
              inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
              sx={{ width: '3rem' }}
            />
          ))}
        </Box>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Confirm
        </Button>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </Box>
  );
};

export default ConfirmCode;
