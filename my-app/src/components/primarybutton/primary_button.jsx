import React from 'react';
import './primarybutton.css';

const PrimaryButton = ({ label, onClick }) => {
  return (
    <button className="primary-button" onClick={onClick} >
      {label}
    </button>
  );
};

export default PrimaryButton;
