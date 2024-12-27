import React, { useState, useContext, useEffect } from 'react';
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import Image from './Image';

import LoginForm from './Form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/auth-context';
import ConfirmCode from './ConfirmCode';
import ForgotPassword from './ForgotPassword';
import ConfirmSignInWithNewPassword from './ConfirmSignInWithNewPassword';

function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [state, setState] = useState({
    showLoginForm: true,

    showConfirmationCode: false,
    showSignInWithNewPasswordRequired: false,
    showForgotPassword: false,
    errorMessage: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      navigate('/admin');
    }
  }, [authCtx.isLoggedIn, navigate]);

  const handleLogin = async (e, email, password) => {
    try {
      setState((prevState) => ({ ...prevState, errorMessage: '' }));
      e.preventDefault();
      const resp = await authCtx.logIn(email, password);

      if (resp && resp.nextStep) {
        if (resp.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          setState((prevState) => ({
            ...prevState,
            showSignInWithNewPasswordRequired: true,
          }));
        }
        setState((prevState) => ({ ...prevState, showLoginForm: false, email, password }));
      }
      if (resp.isSignedIn) {
        authCtx.isLoggedIn = resp.isSignedIn;
        navigate('/admin');
      }
    } catch (err) {
      setState((prevState) => ({ ...prevState, errorMessage: 'Incorrect username or password.' }));
    }
  };

  const handleConfirmationCode = async () => {
    
  };

  const handleConfirmComplete = () => {
    setState((prevState) => ({
      ...prevState,
      showConfirmationCode: false,
      showLoginForm: true,
    }));
  };

  const forgotPassword = () => {
    setState({
      showLoginForm: false,

      showConfirmationCode: false,
      showForgotPassword: true,
      errorMessage: '',
    });
  };

  const handleBackToLogin = () => {
    setState({
      showLoginForm: true,

      showConfirmationCode: false,
      showForgotPassword: false,
      errorMessage: '',
    });
  };
  return (
    <Grid container spacing={2}>
      {isMobile ? (
        <>
          <Grid item xs={12} sm={8} md={5} elevation={6} style={styles.gridItemRight}>
            {state.showLoginForm && (
              <LoginForm
                handleLogin={handleLogin}
                error={state.errorMessage}
                forgotPassword={forgotPassword}
              />
            )}

            {state.showConfirmationCode && (
              <ConfirmCode
                handleConfirmationCode={handleConfirmationCode}
                confirmComplete={handleConfirmComplete}
              />
            )}
            {state.showForgotPassword && <ForgotPassword handleBackToLogin={handleBackToLogin} />}
            {state.showSignInWithNewPasswordRequired && (
              <ConfirmSignInWithNewPassword
                user={{ email: state.email, password: state.password }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} style={styles.gridItemLeft}>
            <Image />
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12} md={6} style={styles.gridItemLeft}>
            <Image />
          </Grid>
          <Grid item xs={12} sm={8} md={5} elevation={6} style={styles.gridItemRight}>
            {state.showLoginForm && (
              <LoginForm
                handleLogin={handleLogin}
                error={state.errorMessage}
                forgotPassword={forgotPassword}
              />
            )}

            {state.showConfirmationCode && (
              <ConfirmCode
                handleConfirmationCode={handleConfirmationCode}
                confirmComplete={handleConfirmComplete}
              />
            )}
            {state.showForgotPassword && <ForgotPassword handleBackToLogin={handleBackToLogin} />}
            {state.showSignInWithNewPasswordRequired && (
              <ConfirmSignInWithNewPassword
                user={{ email: state.email, password: state.password }}
              />
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
}

const styles = {
  gridItemLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  gridItemRight: {
    top: 0,
  },
};

export default Index;
