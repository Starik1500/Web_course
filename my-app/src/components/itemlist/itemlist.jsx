import React from 'react';
import { Link } from 'react-router-dom';
import PrimaryButton from '../primarybutton/primary_button.jsx';
import './itemlist.css';

const ItemList = ({ items }) => {
  return (
    <div className="items-list">
      {items.map(item => (
        <div key={item.id} className="item">
          <img src={item.img} alt={item.name} />
          <h2>{item.name}</h2>
          <p>{item.price}</p>
          <Link to={`/item/${item.id}`}>
            <PrimaryButton label="View More" />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
