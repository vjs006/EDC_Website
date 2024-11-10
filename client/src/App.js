// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import './App.css';
import Regform from "./components/Regform";
import Login from "./components/Login";
import Admin from "./components/Admin"; // Import Admin component

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Regform />} />
        <Route path="/admin" element={<Admin />} /> {/* Add admin route */}
      </Routes>
    </Router>
  );
};

export default App;
