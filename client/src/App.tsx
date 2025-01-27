import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route for routing
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/Error'; // Import the error page for unknown routes

const App = () => {
  const handleLogin = (user: { email: string }) => {
    console.log(`User logged in with email: ${user.email}`);
    // Implement login logic here (e.g., set user in state, redirect, etc.)
  };

  return (
    <div className="app">
      <Routes>
        {/* Define your routes for all pages */}
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
