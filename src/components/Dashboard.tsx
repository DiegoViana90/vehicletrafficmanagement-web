import React from 'react';

const Dashboard: React.FC = () => {
  const companyName = localStorage.getItem('companyName');

  return (
    <div className="dashboard">
      <h1>Bem-vindo à {companyName}</h1>
      {/* Renderize o conteúdo do dashboard aqui */}
    </div>
  );
};

export default Dashboard;
