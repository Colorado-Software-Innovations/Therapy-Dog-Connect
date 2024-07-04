import React, { createContext, useState } from 'react';

export const HospitalContext = createContext({
  selectedHospital: {},
  setSelectedHospital: () => {},
  hospitals: [],
  setHospitals: () => {},
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
  const [hospitals, setHospitals] = useState([]);

  function setSelectedHospital(hospital) {
    setHospital(hospital);
  }

  function setHospitalData(hospitals) {
    setHospitals(hospitals);
  }

  const value = {
    selectedHospital,
    setSelectedHospital,
    hospitals,
    setHospitalData,
  };

  return <HospitalContext.Provider value={value}>{children}</HospitalContext.Provider>;
}

export default HospitalContextProvider;
