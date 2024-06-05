import React, { createContext, useState } from 'react';

export const HospitalContext = createContext({
  selectedHospital: {},
  setSelectedHospital: () => {},
});

function HospitalContextProvider({ children }) {
  const [selectedHospital, setHospital] = useState({
    city: '',
    id: 0,
    isActive: true,
    name: '',
    postalCode: '',
    state: '',
    street: '',
    street2: '',
  });

  function setSelectedHospital(hospital) {
    setHospital(hospital);
  }

  const value = {
    selectedHospital,
    setSelectedHospital,
  };

  return <HospitalContext.Provider value={value}>{children}</HospitalContext.Provider>;
}

export default HospitalContextProvider;
