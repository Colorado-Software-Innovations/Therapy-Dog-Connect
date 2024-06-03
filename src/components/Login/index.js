import React, { useState } from 'react';
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import Image from './Image';
import { signIn, confirmSignIn } from 'aws-amplify/auth';
import LoginForm from './Form';
import ChangePassword from './ChangePassword';
import { useNavigate } from 'react-router-dom';

function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState(false);

  const handleLogin = async (e, email, password) => {
    e.preventDefault();
    await signIn({
      username: 'zachcervi@gmail.com',
      password: password.target.value,
    })
      .then(({ nextStep }) => {
        if (nextStep) {
          setConfirmPassword(true);
        } else {
            navigate('/admin');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChangePassword = async (e, email, password) => {
    e.preventDefault();
    await confirmSignIn({
      username: 'zachcervi@gmail.com',
      password,
      challengeResponse: 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED',
    })
      .then(({ nextStep, isSignedIn }) => {
        if (nextStep === 'DONE' && isSignedIn) {
          //set global state for signed in
          //redirect to portal page
          navigate('/admin');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Grid container spacing={2}>
      {isMobile ? (
        <>
          <Grid item xs={12} sm={8} md={5} elevation={6} style={styles.gridItemRight}>
            {!confirmPassword ? (
              <LoginForm handleLogin={handleLogin} />
            ) : (
              <ChangePassword handleChangePassword={handleChangePassword} />
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
            {!confirmPassword ? (
              <LoginForm handleLogin={handleLogin} />
            ) : (
              <ChangePassword handleChangePassword={handleChangePassword} />
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
