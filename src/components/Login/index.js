/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import { Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import Image from './Image';
import { signUp } from 'aws-amplify/auth';
import LoginForm from './Form';
import ChangePassword from './ChangePassword';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/auth-context';
import ConfirmCode from './ConfirmCode';
import SignUpForm from '../SignUp/Form';
import { confirmSignUp } from 'aws-amplify/auth';
function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showConfirmationCode, setShowConfirmationCode] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (e, email, password) => {
    try {
      setEmail(email);
      e.preventDefault();
      //authCtx.logOut();
      const resp = await authCtx.logIn(email, password);
      if (resp && resp.nextStep) {
        setShowLoginForm(false);
        setShowChangePassword(true);
      }
      if (resp.isSignedIn) {
        authCtx.isLoggedIn = resp.isSignedIn;
        navigate('/admin');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async (e, password) => {
    try {
      e.preventDefault();
      const resp = await authCtx.confirmLogin(email, password);
      if (resp.nextStep.signInStep === 'DONE' && resp.isSignedIn) {
        setShowChangePassword(false);
        navigate('/admin');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmationCode = async (e, code) => {
    try {
      e.preventDefault();
      const result = await confirmSignUp({ username: authCtx.signupEmail, confirmationCode: code });
    } catch (err) {
      console.error(err);
    }
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

  return (
    <Grid container spacing={2}>
      {isMobile ? (
        <>
          <Grid item xs={12} sm={8} md={5} elevation={6} style={styles.gridItemRight}>
            {showLoginForm && <LoginForm handleLogin={handleLogin} toggle={toggle} />}
            {showSignUpForm && <SignUpForm toggle={toggle} handleSignUp={handleSignUp} />}
            {showChangePassword && <ChangePassword handleChangePassword={handleChangePassword} />}
            {showConfirmationCode && (
              <ConfirmCode handleConfirmationCode={handleConfirmationCode} />
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
            {showLoginForm && <LoginForm toggle={toggle} handleLogin={handleLogin} />}
            {showSignUpForm && <SignUpForm toggle={toggle} handleSignUp={handleSignUp} />}
            {showConfirmationCode && (
              <ConfirmCode handleConfirmationCode={handleConfirmationCode} />
            )}
            {showChangePassword && <ChangePassword handleChangePassword={handleChangePassword} />}
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
