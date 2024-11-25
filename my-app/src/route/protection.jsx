import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const isTokenExpired = decodedToken.exp * 1000 < Date.now();

    if (isTokenExpired) {
      localStorage.removeItem('authToken');
      return <Navigate to="/login" />;
    }
  } catch (error) {
    console.error('Помилка перевірки токена:', error);
    localStorage.removeItem('authToken');
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
