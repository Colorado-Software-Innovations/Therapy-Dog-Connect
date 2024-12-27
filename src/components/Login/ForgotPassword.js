import React, { useState, useRef, useCallback } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Password as PasswordIcon,
  ErrorOutline as ErrorOutlineIcon,
  Visibility,
  VisibilityOff,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import validateEmail from '../../utils/EmailValidation.js';

const ForgotPassword = ({ handleBackToLogin }) => {
  const [state, setState] = useState({
    showPassword: false,
    email: '',
    newPassword: '',
    emailError: '',
    showConfirmationCode: false,
    confirmCode: new Array(6).fill(''),
    isLoading: false,
    showSuccessMessage: false,
    showErrorMessage: false,
    errorMessage: '',
    errors: {},
  });
  const inputRefs = useRef([]);

  const handleChange = useCallback(
    (e, index) => {
      const value = e.target.value;
      if (/^[0-9]$/.test(value) || value === '') {
        const newCode = [...state.confirmCode];
        newCode[index] = value;
        setState((prevState) => ({ ...prevState, confirmCode: newCode }));

        if (value !== '' && index < 5) {
          inputRefs.current[index + 1].focus();
        }
      }
    },
    [state.confirmCode],
  );

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
;
    } catch (error) {
      setState((prevSate) => ({
        ...prevSate,
        errorMessage: `Oops something went wrong ${error}`,
        showErrorMessage: true,
      }));
    }
  };

  const validatePassword = (password) => password.length >= 8;

  const handleResetPasswordNextSteps = (output) => {
    const { nextStep } = output;
    if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
      setState((prevState) => ({ ...prevState, showConfirmationCode: true }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState((prevState) => ({ ...prevState, errorMessage: '', isLoading: true }));

    if (!validatePassword(state.newPassword)) {
      setState((prevState) => ({
        ...prevState,
        errors: { password: 'Password must be at least 8 characters long' },
        isLoading: false,
      }));
      return;
    }

    const code = state.confirmCode.join('');
    try {
      await confirmResetPassword({
        username: state.email,
        confirmationCode: code,
        newPassword: state.newPassword,
      });
      setState((prevState) => ({
        ...prevState,
        showSuccessMessage: true,
        isLoading: false,
      }));
      setTimeout(handleBackToLogin, 2000);
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        showErrorMessage: true,
        confirmCode: new Array(6).fill(''),
        errorMessage: `Oops something went wrong. ${error}`,
        isLoading: false,
      }));
    }
  };

  const handleClickShowPassword = () => {
    setState((prevState) => ({ ...prevState, showPassword: !prevState.showPassword }));
  };

  const isAllFilledAndNotLoading =
    state.confirmCode.every((code) => code !== '') && !state.isLoading;

  return (
    <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <PasswordIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Forgot your password?
      </Typography>
      {!state.showConfirmationCode ? (
        <Box component="form" noValidate onSubmit={handleForgotPassword} sx={{ mt: 1 }}>
          <TextField
            onChange={(e) => setState((prevState) => ({ ...prevState, email: e.target.value }))}
            onBlur={() => {
              if (state.email && !validateEmail(state.email)) {
                setState((prevState) => ({ ...prevState, emailError: 'Invalid email format' }));
              } else {
                setState((prevState) => ({ ...prevState, emailError: '' }));
              }
            }}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            error={!!state.emailError}
            helperText={state.emailError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {state.emailError && (
                    <IconButton size="small">
                      <ErrorOutlineIcon color="error" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Reset
          </Button>
          <Grid container>
            <Grid item xs>
              <Button style={styles.button} onClick={handleBackToLogin}>
                Back to Login
              </Button>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, newPassword: e.target.value }))
            }
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type={state.showPassword ? 'text' : 'password'}
            id="NewPassword"
            autoComplete="current-password"
            error={!!state.errors.password}
            helperText={state.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            {state.confirmCode.map((_, index) => (
              <TextField
                key={index}
                inputRef={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                value={state.confirmCode[index]}
                margin="normal"
                required
                name={`code-${index}`}
                label=""
                type="text"
                disabled={state.showSuccessMessage || state.isLoading}
                inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                sx={{ width: '3rem' }}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            {state.isLoading && <CircularProgress />}
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isAllFilledAndNotLoading}
          >
            {state.showSuccessMessage ? (
              <>
                <CheckCircleOutlineIcon sx={{ marginRight: '0.5rem' }} />
                Confirmed
              </>
            ) : (
              'Confirm'
            )}
          </Button>
          {state.showSuccessMessage && (
            <Typography sx={{ mt: 2, color: '#275C4A', textAlign: 'center' }}>
              Password reset successfully!
            </Typography>
          )}
          {state.showErrorMessage && (
            <Typography sx={{ mt: 2, color: '#cc0000', textAlign: 'center' }}>
              {state.errorMessage}
            </Typography>
          )}
        </Box>
      )}
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

export default ForgotPassword;
