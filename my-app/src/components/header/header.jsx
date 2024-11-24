import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SignOutButton from '../sign_out_button/sign_out';
import './header.css';

const Header = ({ onSearch }) => {
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <header className="header">
      <h1>Airplane Sales Company</h1>
      {!isAuthPage && (
        <>
          <nav>
            <NavLink to="/home" activeClassName="active">Home</NavLink>
            <NavLink to="/catalog" activeClassName="active">Catalog</NavLink>
            <NavLink to="/cart" activeClassName="active">Cart</NavLink>
          </nav>
          {location.pathname === '/catalog' ? (
            <input
              type="search"
              placeholder="Search..."
              onChange={onSearch}
            />
          ) : (
            <SignOutButton className="sign-out-button" />
          )}
        </>
      )}
    </header>
  );
};

export default Header;
