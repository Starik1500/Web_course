import React from 'react';
import './header.css';

const Header = () => {
  return (
    <header>
      <h1>Airplane Sales Company</h1>
      <nav>
        <a href="home">Home</a>
        <a href="catalog">Catalog</a>
        <a href="cart">Cart</a>
      </nav>
      <input type="search" id="find_input" placeholder="Search for airplanes..." />
    </header>
  );
};

export default Header;
