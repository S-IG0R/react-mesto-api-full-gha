import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ redirectPath, children, loggedIn }) => {
  return loggedIn 
    ? children ?? <Outlet /> 
    : <Navigate to={redirectPath} replace />;
};