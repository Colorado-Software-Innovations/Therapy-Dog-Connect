/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import { Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import Image from './Image';

import LoginForm from './Form';
import ChangePassword from './ChangePassword';
//import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/auth-context';

function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (e, email, password) => {
    try {
      setEmail(email);
      e.preventDefault();
      //authCtx.logOut();
      const resp = await authCtx.loginIn(email, password);
      if (resp && resp.nextStep) {
        setShowLoginForm(false);
        setShowChangePassword(true);
      }
    } catch (error) {
      throw new error(error);
    }
  };

  const handleChangePassword = async (e, password) => {
    try {
      e.preventDefault();
      const resp = await authCtx.confirmLogIn(email, password);
      if (resp.nextStep.signInStep === 'DONE') {
        const pwdResp = await authCtx.resetUserPassword(email, password);
        setShowChangePassword(false);
      }
    } catch (error) {
      throw new error(error);
    }
  };

  const handleConfirmationCode = async (e, code) => {
    try {
      e.preventDefault();
      const resp = await authCtx.confirmUserSignUp(email, code);
    } catch (error) {
      throw new error(error);
    }
  };

  return (
    <Grid container spacing={2}>
      {isMobile ? (
        <>
          <Grid item xs={12} sm={8} md={5} elevation={6} style={styles.gridItemRight}>
            {showLoginForm && <LoginForm handleLogin={handleLogin} />}
            {showChangePassword && <ChangePassword handleChangePassword={handleChangePassword} />}
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
            {showLoginForm && <LoginForm handleLogin={handleLogin} />}
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
