import React, { useState, useContext } from 'react';
import { ItemContext } from '../context/context';
import ItemList from '../itemlist/itemlist.jsx';
import './class.css';

const Class_section = () => {
  const [showCatalog, setShowCatalog] = useState(false); 
  const { filteredItems } = useContext(ItemContext);

  const showMoreItems = () => {
    setShowCatalog(true);
  };

  return (
    <section id="class_s">
      <h2>Our Aircraft Models</h2>
      <p>Explore our premium selection of aircraft available for sale.</p>
      
      {!showCatalog && (
        <div className="image-row">
          <div className="image-container">
            <img 
              src="/img/Boeing 737.jpg" 
              alt="Commercial Jet" 
              className="image" 
            />
            <p>Commercial Jet</p>
          </div>

          <div className="image-container">
            <img 
              src="/img/Airbus A220.jpg" 
              alt="Regional Aircraft" 
              className="image" 
            />
            <p>Regional Aircraft</p>
          </div>

          <div className="image-container">
            <img 
              src="/img/Boeing 777.jpg" 
              alt="Cargo Plane" 
              className="image" 
            />
            <p>Cargo Plane</p>
          </div>
        </div>
      )}

      {!showCatalog && (
        <button onClick={showMoreItems} className="button">
          View More
        </button>
      )}

      {showCatalog && <ItemList items={filteredItems} />}
    </section>
  );
};

export default Class_section;