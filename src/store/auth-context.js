/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect } from 'react';
import { signIn, signOut, confirmSignIn, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
export const AuthContext = createContext({
  token: null,
  isLoggedIn: false,
  signUpEmail: '',
  logIn: (username, password) => {},
  confirmLogIn: (username, password) => {},
  setItLoggedIn: (isLoggedIn) => {},
  getUserSession: () => {},
  setSignUpEmail: (email) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signupEmail, setEmail] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        setIsSignedIn(true);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };

    checkUserSession();
  }, []);

  const logIn = async (username, password) => {
    const result = await signIn({
      username: username,
      password: password,
    });
    if (result.isSignedIn) {
      setIsSignedIn(result.isSignedIn);
      const session = await getUserSession();
      setToken(session.tokens.accessToken.toString());
    }
    return result;
  };

  const confirmLogin = async (username, password) => {
    return await confirmSignIn({
      username,
      password,
      challengeResponse: 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED',
    });
  };

  const getUserSession = async () => {
    return await fetchAuthSession();
  };

  const setSignUpEmail = (email) => {
    setEmail(email);
  };
  const logOut = async () => {
    await signOut();
  };
  const value = {
    logIn,
    confirmLogin,
    isLoggedIn: isSignedIn,
    getUserSession,
    token,
    setSignUpEmail,
    signupEmail,
    logOut,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
