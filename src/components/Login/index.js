import React, { useState, useContext } from 'react';
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import Image from './Image';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import LoginForm from './Form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/auth-context';
import ConfirmCode from './ConfirmCode';
import SignUpForm from '../SignUp/Form';

function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [state, setState] = useState({
    showLoginForm: true,
    showSignUpForm: false,
    showConfirmationCode: false,
    errorMessage: '',
  });

  const handleLogin = async (e, email, password) => {
    try {
      setState((prevState) => ({ ...prevState, errorMessage: '' }));
      e.preventDefault();
      const resp = await authCtx.logIn(email, password);
      if (resp && resp.nextStep) {
        setState((prevState) => ({ ...prevState, showLoginForm: false }));
      }
      if (resp.isSignedIn) {
        authCtx.isLoggedIn = resp.isSignedIn;
        navigate('/admin');
      }
    } catch (err) {
      console.error(err);
      setState((prevState) => ({ ...prevState, errorMessage: 'Incorrect username or password.' }));
    }
  };

  const handleConfirmationCode = async (e, code) => {
    e.preventDefault();
    try {
      const resp = await confirmSignUp({ username: authCtx.signupEmail, confirmationCode: code });
      if (resp.isSignUpComplete) {
        return resp;
      }
    } catch (err) {
      return err;
    }
  };

  const toggle = () => {
    setState((prevState) => ({
      ...prevState,
      showLoginForm: !prevState.showLoginForm,
      showSignUpForm: prevState.showLoginForm,
    }));
  };

  const handleSignUp = async (e, email, password, phoneNumber) => {
    authCtx.setSignUpEmail(email);
    const { isSignUpComplete } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          phone_number: phoneNumber || '+15555555555', // E.164 number convention
        },
      },
    });
    if (!isSignUpComplete) {
      setState((prevState) => ({
        ...prevState,
        showSignUpForm: false,
        showConfirmationCode: true,
      }));
    }
  };

  const handleConfirmComplete = () => {
    setState((prevState) => ({
      ...prevState,
      showConfirmationCode: false,
      showLoginForm: true,
    }));
  };

  return (
    <Grid container spacing={2}>
      {isMobile ? (
        <>
          <Grid item xs={12} sm={8} md={5} elevation={6} style={styles.gridItemRight}>
            {state.showLoginForm && (
              <LoginForm handleLogin={handleLogin} toggle={toggle} error={state.errorMessage} />
            )}
            {state.showSignUpForm && <SignUpForm toggle={toggle} handleSignUp={handleSignUp} />}
            {state.showConfirmationCode && (
              <ConfirmCode
                handleConfirmationCode={handleConfirmationCode}
                confirmComplete={handleConfirmComplete}
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
              <LoginForm handleLogin={handleLogin} toggle={toggle} error={state.errorMessage} />
            )}
            {state.showSignUpForm && <SignUpForm toggle={toggle} handleSignUp={handleSignUp} />}
            {state.showConfirmationCode && (
              <ConfirmCode
                handleConfirmationCode={handleConfirmationCode}
                confirmComplete={handleConfirmComplete}
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
