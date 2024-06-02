import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/index';
import MainAppBar from './components/UI/AppBar/AppBar';

function App() {
  return (
    <div className="App">
      <MainAppBar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
