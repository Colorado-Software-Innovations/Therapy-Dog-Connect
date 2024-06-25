import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Grid from '@mui/material/Grid';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CopyRight from '../UI/CopyRight';

const LoginForm = ({ handleLogin, toggle, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    // Basic email regex for validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate email before submitting
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    } else {
      setEmailError('');
    }
    handleLogin(e, email, password);
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
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => {
            if (email && !validateEmail(email)) {
              setEmailError('Invalid email format');
            } else {
              setEmailError('');
            }
          }}
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          error={!!emailError}
          helperText={emailError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {emailError && (
                  <IconButton size="small">
                    <ErrorOutlineIcon color="error" />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        {error && (
          <Typography sx={{ mt: 2, color: '#cc0000', textAlign: 'center' }}>{error}</Typography>
        )}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Button style={styles.button}>Forgot Password?</Button>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs>
            <Button style={styles.button} onClick={toggle}>
              Sign Up
            </Button>
          </Grid>
        </Grid>

        <CopyRight sx={{ mt: 5 }} />
      </Box>
    </Box>
  );
};

const styles = {
  button: {
    margin: 0,
    fontFamily: 'Noto Sans, Roboto, Arial, sans-serif',
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: 1.43,
    color: '#275C4A',
    textTransform: 'none',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(39, 92, 74, 0.4)',
  },
};

export default LoginForm;
