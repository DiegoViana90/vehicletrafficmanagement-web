import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChangePassword from './components/ChangePassword';
import Drivers from './components/Drivers';
import VehicleTraffic from './components/VehicleTraffic';
import Fines from './components/Fines';
import Fuel from './components/Fuel';
import Contracts from './components/Contracts';
import Companies from './components/Companies';
import UpdateCompany from './components/UpdateCompany';
import Vehicles from './components/Vehicles';
import SearchVehicle from './components/SearchVehicle';
import VehicleHistoric from './components/VehicleHistoric';
import UpdateContract from './components/UpdateContract';
import { RootState } from './store';

interface ProtectedRouteProps {
  condition: boolean;
  redirectTo: string;
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ condition, redirectTo, children }) => {
  return condition ? children : <Navigate to={redirectTo} />;
};

const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = !!user;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/login">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute condition={isAuthenticated && user?.isFirstAccess} redirectTo="/dashboard">
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drivers"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/login">
              <Drivers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicletraffic"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/login">
              <VehicleTraffic />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fuel"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/login">
              <Fuel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contracts"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/login">
              <Contracts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fines"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/login">
              <Fines />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/login">
              <Companies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-company"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/login">
              <UpdateCompany />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/login">
              <Vehicles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-vehicle"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/login">
              <SearchVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-contract"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/login">
              <UpdateContract />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicle-historic"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/login">
              <VehicleHistoric />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
