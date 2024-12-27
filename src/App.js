import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/index';
import Locations from './components/Locations';
import Volunteers from './components/Volunteers';
import About from './components/About';
import Contact from './components/Contact';
import RequestDemo from './components/RequestADemo';
import Login from './components/Login';
import AdminHome from './components/Portal';
import MainAppBar from './components/UI/AppBar/AppBar';
import { AuthContext } from './store/auth-context';
import HospitalContextProvider from './store/hospital-context';
import Hospitals from './components/Portal/Hospital';
import Chat from './components/Portal/Chat';
import VisitDetails from './components/Portal/Hospital/VisitDetails';
import Settings from './components/Portal/Settings';
import RequestVisit from './components/Visits';
import SnackbarAlert from './components/UI/SnackBarAlert';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.AWS_USER_POOLS_ID,
  ClientId: 'abcdefgh1234567890', //
};


function App() {
  const authCtx = useContext(AuthContext);
  return (
    <div className="App">
      <MainAppBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/volunteers" element={<Volunteers />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/request  demo" element={<RequestDemo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/visit/hospitals/:id" element={<RequestVisit />} />

        {authCtx.isLoggedIn && (
          <Route path="/admin" element={<AdminHome />}>
            <Route
              path="hospitals"
              element={
                <HospitalContextProvider>
                  <Hospitals />
                </HospitalContextProvider>
              }
            />
            <Route
              path="hospitals/:id"
              element={
                <HospitalContextProvider>
                  <VisitDetails />
                </HospitalContextProvider>
              }
            />
            <Route path="chat" element={<Chat />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        )}
      </Routes>
      <SnackbarAlert />
    </div>
  );
}

export default App;
