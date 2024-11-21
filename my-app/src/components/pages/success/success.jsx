import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../header/header.jsx';
import Footer from '../../footer/footer.jsx';
import './success.css';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
    <Header/>
    <div className="success-container">
    <div className="success-content">
      <h2 id="success-title">Order Successful!</h2>
      <p id="success-text">
        Your order has been placed successfully. Thank you for shopping with us!
      </p>
    </div>
    <div className="button-wrapper">
      <button 
        id="home-button" 
        className="success-button" 
        onClick={() => navigate('/')}
        >
          Go to Home
        </button>
      </div>
    </div>
    <Footer/>
    </React.Fragment>
  );
};

export default SuccessPage;
