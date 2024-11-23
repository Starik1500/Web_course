import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Отримуємо дані про користувача з localStorage
  const user = JSON.parse(localStorage.getItem('user')); // Парсимо JSON-дані

  // Якщо користувача немає або дані неповні, перенаправляємо на сторінку логіну
  if (!user || !user.email || !user.userId) {
    return <Navigate to="/login" />;
  }

  // Якщо користувач існує, дозволяємо доступ
  return children;
};

export default ProtectedRoute;
