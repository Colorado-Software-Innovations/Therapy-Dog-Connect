/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect } from 'react';
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


  const logIn = async () => {
    
  };



  const getUserSession = async () => {
 
  };

  const setSignUpEmail = (email) => {
    setEmail(email);
  };

  const value = {
    logIn,

    isLoggedIn: isSignedIn,
    getUserSession,
    token,
    setSignUpEmail,
    signupEmail,
  
    currentUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
