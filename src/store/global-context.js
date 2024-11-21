// context/AppContext.js

import React, { createContext, useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/LocalStorage';

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  // State for selected hospital
  const [selectedHospital, setSelectedHospital] = useState(() =>
    getFromLocalStorage('selectedHospital'),
  );

  // State for other global data
  const [selectedUser, setSelectedUser] = useState(() =>
    getFromLocalStorage('selectedUser'),
  );

  // Persist selected hospital to localStorage
  useEffect(() => {
    saveToLocalStorage('selectedHospital', selectedHospital);
  }, [selectedHospital]);

  // Persist user preferences to localStorage
  useEffect(() => {
    saveToLocalStorage('selectedUser', selectedUser);
  }, [selectedUser]);

  return (
    <AppContext.Provider
      value={{
        selectedHospital,
        setSelectedHospital,
        selectedUser,
        setSelectedUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
