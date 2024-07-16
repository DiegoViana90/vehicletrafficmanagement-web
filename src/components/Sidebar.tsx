import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h3>Módulos</h3>
      <ul>
        <li><Link to="/fuel-log">Fuel Log</Link></li>
        <li><Link to="/traffic-log">Traffic Log</Link></li>
        <li><Link to="/drivers">Drivers</Link></li>
        {/* Adicione outros módulos aqui */}
      </ul>
    </div>
  );
};

export default Sidebar;
