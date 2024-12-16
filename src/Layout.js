import React from 'react';
import Menu from './Menu';
import Breadcrumb from './Breadcrumb';
import './Layout.css'; 

function Layout({ children }) {
  return (
    <div className="layout">
      {/* Menu Section */}
      <Menu />

      {/* Breadcrumb Section */}
      <Breadcrumb />

      {/* Page Content */}
      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default Layout;
