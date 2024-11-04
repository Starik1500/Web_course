import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer>
      <div class='content'>
        <div class='textContainer'>
          <p>Aircraft Sales Company</p>
          <p>Providing top-quality aircraft for commercial and cargo needs. Experience unmatched service and expertise in the aviation industry.</p>
        </div>
        <div class='iconContainer'>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class='iconLink'>
            <img src="/img/facebook.png" alt="Facebook" class='icon' />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class='iconLink'>
            <img src="/img/twitter.png" alt="Twitter" class='icon' />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class='iconLink'>
            <img src="/img/odnoklassniki.png" alt="Odnoklassniki" class='icon' />
          </a>
        </div>
      </div>
      <div class='ruler'></div>
      <p class='copyright'>© 2024 Aircraft Sales Company</p>
    </footer>
  );
};

export default Footer;
