import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import PasswordIcon from '@mui/icons-material/Password';
import Typography from '@mui/material/Typography';
import Copyright from '../UI/CopyRight';

const ChangePassword = ({ handleChangePassword }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
        You must change your password
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={(e) => handleChangePassword(e, password, confirmPassword)}
        sx={{ mt: 1 }}
      >
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
        />
        <TextField
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          required
          fullWidth
          name="confirm password"
          label="Confirm Password"
          type="password"
          id="confirm-password"
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          onSubmit={(e) => handleChangePassword(e, password, confirmPassword)}
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

export default ChangePassword;
