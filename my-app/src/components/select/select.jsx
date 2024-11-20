import React from 'react';
import './select.css';

const Select = ({ options, onChange }) => {
  return (
    <select className="select" onChange={onChange}>
      {options.map((option, event) => (
        <option key={event} value={option} selected>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Select;
