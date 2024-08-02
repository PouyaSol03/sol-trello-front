import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const authData = localStorage.getItem('authData');
  return authData ? element : <Navigate to="/login" />;
};

export { PrivateRoute };
