import React from 'react';
import ClinicSystem from './ClinicSystem';

function App() {
  return (
    <div className="container">
      <div className="navbar">
        <h1 style={{ color: 'Black', margin: 0, fontSize: '24px' }}>Gestion de Clinica</h1>
      </div>
      <div className="content">
        <ClinicSystem />
      </div>
    </div>
  );
}
export default App;