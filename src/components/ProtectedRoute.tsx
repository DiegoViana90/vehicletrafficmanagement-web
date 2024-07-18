import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC<{ isFirstAccess: boolean }> = ({ isFirstAccess }) => {
    if (isFirstAccess) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;
