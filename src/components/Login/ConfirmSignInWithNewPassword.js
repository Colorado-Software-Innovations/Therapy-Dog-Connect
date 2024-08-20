import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Password as PasswordIcon } from '@mui/icons-material';
import { confirmSignIn } from '@aws-amplify/auth';
import { AuthContext } from '../../store/auth-context';

function ConfirmSignInWithNewPassword({ user }) {
  const authCtx = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false); // Stop loading
      return;
    }

    try {
      // Sign in the user with their temporary password
      const authenticatedUser = await confirmSignIn({
        username: user.email,
        password: newPassword,
        challengeResponse: newPassword,
      });

      authCtx.isLoggedIn = authenticatedUser.isSignedIn;
      if (authCtx.isLoggedIn) {
        navigate(`/admin`);
      }
    } catch (err) {
      setError(err.message || 'Failed to set the new password');
    } finally {
      setLoading(false); // Stop loading after the operation is done
    }
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
      <Typography variant="h5" component="h1" gutterBottom>
        Set New Password
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          fullWidth
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
          error={!!error}
        />
        <TextField
          fullWidth
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          error={!!error}
        />
        {error && <FormHelperText error>{error}</FormHelperText>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </form>
    </Box>
  );
}

export default ConfirmSignInWithNewPassword;
