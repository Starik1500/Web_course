import React, { useState } from 'react';
import Header from '../../header/header.jsx';
import Footer from '../../footer/footer.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import './login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      if (response.data.message === 'Успішний вхід') {
        const { token } = response.data;

        localStorage.setItem('authToken', token);

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;
        localStorage.setItem('user_id', userId);

        dispatch({ type: 'CLEAR_CART' });

        navigate('/home');
      } else {
        setErrorMessage('Помилка входу. Спробуйте ще раз.');
      }
    } catch (loginError) {
      console.error('Помилка входу:', loginError);
      setErrorMessage('Невірний email або пароль.');
    }
  };

  return (
    <React.Fragment>
      <Header />
      <div className="login-container">
        <div className="login-header">Login</div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Login</button>
          </div>
        </form>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <p className="signup-redirect">
          Don't have an account?{' '}
          <button className="btn-link" onClick={() => navigate('/signup')}>Sign Up</button>
        </p>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default LoginPage;
