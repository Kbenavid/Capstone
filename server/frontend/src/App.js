// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PartsList    from './components/PartsList';
import RegisterForm from './components/RegisterForm';
import LoginForm    from './components/LoginForm';

function App() {
  // track login in React state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/register"
          element={<RegisterForm />}
        />
        <Route
  path="/login"
  element={<LoginForm onLogin={() => setIsLoggedIn(true)} />}
/>

        <Route
          path="/"
          element={
            isLoggedIn
              ? <PartsList />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

