import React, { useContext } from 'react';
import { Amplify } from 'aws-amplify';
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
import HospitalDetails from './components/Portal/Hospital/HospitalDetails';
import Settings from './components/Portal/Settings';
import RequestVisit from './components/Visits';
import VolunteerProfile from './components/Portal/Hospital/VolunteerProfile';
// eslint-disable-next-line
import config from './amplifyconfiguration.json';
import SnackbarAlert from './components/UI/SnackBarAlert';
import AppProvider from './store/global-context';

Amplify.configure(config);
function App() {
  const authCtx = useContext(AuthContext);
  return (
    <AppProvider>
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
                    <HospitalDetails />
                  </HospitalContextProvider>
                }
              />
              <Route
                path="hospitals/:id/users/:id"
                element={
                  <HospitalContextProvider>
                    <VolunteerProfile />
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
    </AppProvider>
  );
}

export default App;
