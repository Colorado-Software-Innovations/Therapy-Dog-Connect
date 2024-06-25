/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
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
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showConfirmationCode, setShowConfirmationCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e, email, password) => {
    try {
      setErrorMessage('');

      e.preventDefault();
      const resp = await authCtx.logIn(email, password);
      if (resp && resp.nextStep) {
        setShowLoginForm(false);
      }
      if (resp.isSignedIn) {
        authCtx.isLoggedIn = resp.isSignedIn;
        navigate('/admin');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Incorrect username or password.');
    }
  };

  const handleConfirmationCode = async (e, code) => {
    e.preventDefault();
    return confirmSignUp({ username: authCtx.signupEmail, confirmationCode: code })
      .then((resp) => {
        if (resp.isSignUpComplete) {
          return resp;
        }
      })
      .catch((err) => err);
  };

  const toggle = () => {
    setShowLoginForm(!showLoginForm);
    setShowSignUpForm(showLoginForm);
  };

  const handleSignUp = async (e, email, password, phoneNumber) => {
    authCtx.setSignUpEmail(email);
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          phone_number: phoneNumber ? phoneNumber : '+15555555555', // E.164 number convention
        },
      },
    });
    if (!isSignUpComplete) {
      setShowSignUpForm(false);
      setShowConfirmationCode(true);
    }
  };

  const handleConfirmComplete = () => {
    setShowConfirmationCode(false);
    setShowLoginForm(true);
  };
  return (
    <Grid container spacing={2}>
      {isMobile ? (
        <>
          <Grid item xs={12} sm={8} md={5} elevation={6} style={styles.gridItemRight}>
            {showLoginForm && (
              <LoginForm handleLogin={handleLogin} toggle={toggle} error={errorMessage} />
            )}
            {showSignUpForm && <SignUpForm toggle={toggle} handleSignUp={handleSignUp} />}
            {showConfirmationCode && (
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
            {showLoginForm && (
              <LoginForm toggle={toggle} handleLogin={handleLogin} error={errorMessage} />
            )}
            {showSignUpForm && <SignUpForm toggle={toggle} handleSignUp={handleSignUp} />}
            {showConfirmationCode && (
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
