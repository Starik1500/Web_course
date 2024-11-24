import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer>
      <div className='content'>
        <div className='textContainer'>
          <p>Aircraft Sales Company</p>
          <p>Providing top-quality aircraft for commercial and cargo needs. Experience unmatched service and expertise in the aviation industry.</p>
        </div>
        <div className='iconContainer'>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className='iconLink'>
            <img src="/img/facebook.png" alt="Facebook" className='icon' />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className='iconLink'>
            <img src="/img/twitter.png" alt="Twitter" className='icon' />
          </a>
          <a href="https://.com" target="_blank" rel="noopener noreferrer" className='iconLink'>
            <img src="/img/odnoklassniki.png" alt="Odnoklassniki" className='icon' />
          </a>
        </div>
      </div>
      <div className='ruler'></div>
      <p className='copyright'>© 2024 Aircraft Sales Company</p>
    </footer>
  );
};

export default Footer;
