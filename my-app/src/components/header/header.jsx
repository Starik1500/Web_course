import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './header.css';

const Header = ({onSearch}) => {
  const location = useLocation();
  const isCatalogPage = location.pathname === '/catalog';

  return (
    <header className="header">
      <h1>Airplane Sales Company</h1>
      <nav>
        <NavLink to="/home" activeClassName="active">Home</NavLink>
        <NavLink to="/catalog" activeClassName="active">Catalog</NavLink>
        <NavLink to="/cart" activeClassName="active">Cart</NavLink>
      </nav>
      {isCatalogPage ? (
        <input
          type="search"
          placeholder="Search..."
          onChange={onSearch}
        />
      ) : (
        <div className="search-placeholder"></div> 
      )}
    </header>
  );
};

export default Header;
