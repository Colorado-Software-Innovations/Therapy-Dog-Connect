/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect } from 'react';
import * as CryptoJS from 'crypto-js';
import {
  signIn,
  signOut,
  getCurrentUser,
  confirmSignIn,
  resetPassword,
  confirmSignUp,
} from 'aws-amplify/auth';
export const AuthContext = createContext({
  currentUser: null,
  isAuthenticated: false,
  isSignedIn: false,
  // eslint-disable-next-line no-unused-vars
  loginIn: (email, password) => {},
  logOut: () => {},
  setCurrentUser: () => {},
  setIsAuthenticated: () => {},
  confirmLogIn: () => {},
  resetUserPassword: (password) => {},
  confirmUserSignUp: (email, confirmationCode) => {},
});

function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        setIsAuthenticated(true);
        // const decryptedToken = decryptToken(localStorage.getItem('token'));
        // if (decryptedToken) {
        //   // Optional: Use the decrypted token if needed
        // }
      } catch (error) {
        throw new error(error);
      }
    };

    checkUserSession();

    // Cleanup function to clear local storage on unmount
    return () => {
      localStorage.removeItem('token');
    };
  }, []);

  // const encryptToken = (token) => {
  //   return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
  // };

  // const decryptToken = (encryptedToken) => {
  //   try {
  //     const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
  //     return bytes.toString(CryptoJS.enc.Utf8);
  //   } catch (error) {
  //     console.error('Error decrypting token:', error);
  //     return null;
  //   }
  // };

  const confirmLogIn = async (username, password) => {
    return await confirmSignIn({
      username: 'zachcervi@gmail.com',
      password,
      challengeResponse: 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED',
    });
  };

  const confirmUserSignUp = async (username, confirmationCode) => {
    return await confirmSignUp({ username, confirmationCode });
  };

  const resetUserPassword = async (username, password) => {
    return await resetPassword({ username, password });
  };

  const loginIn = async (username, password) => {
    try {
      const status = await signIn({ username, password });
      const { isSignedIn, nextStep } = status;
      if (isSignedIn) {
        // setCurrentUser(user);
        // setIsAuthenticated(true);
        // localStorage.setItem('token', encryptToken(user.signInUserSession.accessToken.jwtToken));
      } else {
        return status;
      }
    } catch (error) {
      throw new error(error);
    }
  };

  const logOut = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      setIsAuthenticated(false);
      //localStorage.removeItem('token');
    } catch (error) {
      throw new error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loginIn,
        logOut,
        setCurrentUser,
        setIsAuthenticated,
        confirmLogIn,
        resetUserPassword,
        confirmUserSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
