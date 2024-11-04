import React from 'react';
import './select.css';

const Select = ({ options, onChange }) => {
  return (
    <select className="select" onChange={onChange}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Select;
