import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import LoginPage from './LoginPage';
import HistoricalData from './HistoricalData';
import VersionLog from './VersionLog';
import Dashboard from './Dashboard';
import SliderPage from './SliderPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/HistoricalData" element={<Layout><HistoricalData /></Layout>} />
      <Route path="/VersionLog" element={<Layout><VersionLog /></Layout>} />
      <Route path="/Dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/SliderPage" element={<Layout><SliderPage /></Layout>} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
