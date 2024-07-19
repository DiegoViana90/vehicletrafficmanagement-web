import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isFirstAccess: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isFirstAccess }) => {
    if (isFirstAccess) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;
