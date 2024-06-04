import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Copyright from '../UI/CopyRight';
import Grid from '@mui/material/Grid';

const LoginForm = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <Box
        component="form"
        noValidate
        onSubmit={(e) => handleLogin(e, email, password)}
        sx={{ mt: 1 }}
      >
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
        />
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          onSubmit={(e) => handleLogin(e, email, password)}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </Box>
  );
};

export default LoginForm;
