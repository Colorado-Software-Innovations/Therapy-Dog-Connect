import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/index';
import Locations from './components/Locations';
import Volunteers from './components/Volunteers';
import About from './components/About';
import Contact from './components/Contact';
import RequestDemo from './components/RequestADemo';
import Login from './components/Login';
import MainAppBar from './components/UI/AppBar/AppBar';

function App() {
  return (
    <div className="App">
      <MainAppBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/volunteers" element={<Volunteers />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/request a demo" element={<RequestDemo />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
