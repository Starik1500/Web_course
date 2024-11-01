import React from 'react';
import { NavLink } from 'react-router-dom';
import './header.css';

const Header = () => {
  return (
    <header className="header">
      <h1>Airplane Sales Company</h1>
      <nav>
        <NavLink to="/home" activeClassName="active">Home</NavLink>
        <NavLink to="/catalog" activeClassName="active">Catalog</NavLink>
        <NavLink to="/cart" activeClassName="active">Cart</NavLink>
      </nav>
      <input
        type="search"
        placeholder="Search..."
      />
    </header>
  );
};

export default Header;
