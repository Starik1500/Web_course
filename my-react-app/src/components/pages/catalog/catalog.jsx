import React, { useState } from 'react';
import PrimaryButton from '../../primarybutton/primary_button';
import Select from '../../select/select';
import Header from '../../header/header.jsx';
import Footer from '../../footer/footer.jsx';
import { Link } from 'react-router-dom';
import './catalog.css';

const CatalogPage = () => {
  const initialItems = [
    { id: 1, img: '/img/Airbus A220.jpg', name: 'Airbus A220', price: '$10' },
    { id: 2, img: '/img/Boeing 737.jpg', name: 'Boeing 737', price: '$15' },
    { id: 3, img: '/img/Boeing 777.jpg', name: 'Boeing 777', price: '$20' },
    { id: 4, img: '/img/tapok.jpg', name: 'Tapok', price: '$100' },
  ];

  const [items, setItems] = useState(initialItems);
  const [filteredItems, setFilteredItems] = useState(initialItems);

  const handleFilter = (event) => {
    const selectedValue = event.target.value;
    const filtered = items.filter(item => item.name.includes(selectedValue));
    setFilteredItems(filtered);
  };

  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    const filtered = items.filter(item => item.name.toLowerCase().includes(searchText));
    setFilteredItems(filtered);
  };

  return (
    <div className="catalog">
      <Header onSearch={handleSearch} /> {}
      <div className="select-container">
        <Select options={['All', 'Category 1', 'Category 2']} onChange={handleFilter} />
        <Select options={['All', 'Category 1', 'Category 2']} onChange={handleFilter} />
        <PrimaryButton label="Apply" />
      </div>
      <div className="items-list">
        {filteredItems.map(item => (
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
      <Footer />
    </div>
  );
};

export default CatalogPage;
