import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Breadcrumb.css';

function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <div className="breadcrumb">
      <Link to="/">Home</Link>
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        return (
          <React.Fragment key={path}>
            <span> / </span>
            <Link to={path}>{segment}</Link>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Breadcrumb;
