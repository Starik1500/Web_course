import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import CatalogPage from './components/pages/catalog/catalog.jsx';
import CartPage from './components/pages/cart/cart.jsx';
import HomePage from './components/pages/home/home.jsx';
import CheckoutPage from './components/checkout/checkout.jsx';
import SuccessPage from './components/pages/success/success.jsx';
import ItemPage from './components/item/item.jsx';
import LoginPage from './components/pages/login/login.jsx';
import SignUpPage from './components/pages/sign_up/sign_up.jsx';
import { ItemProvider } from './components/context/context.jsx';
import ProtectedRoute from './route/protection.jsx';
import './App.css';

function App() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user_id');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <ItemProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/catalog"
              element={
                <ProtectedRoute>
                  <CatalogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/item/:id"
              element={
                <ProtectedRoute>
                  <ItemPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/success"
              element={
                <ProtectedRoute>
                  <SuccessPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ItemProvider>
      </Router>
    </Provider>
  );
}

export default App;
