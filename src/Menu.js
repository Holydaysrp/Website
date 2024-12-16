import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('authToken'); // Clear auth token
    navigate('/'); // Redirect to Login
  };

  return (
    <nav className="menu">
      <ul>
        <li><Link to="/Dashboard">Dashboard</Link></li>
        <li><Link to="/HistoricalData">Historical Data</Link></li>
        <li><Link to="/VersionLog">Version Log</Link></li>
        <li><Link to="/SliderPage">WebPaper</Link></li>
        <li><button onClick={logout} className="logout-button">Logout</button></li>
      </ul>
    </nav>
  );
};

export default Menu;
