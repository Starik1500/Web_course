import React from 'react';
import './class.css';

const Class_section = () => {
  return (
    <section id="class_s">
      <h2>Our Aircraft Models</h2>
      <p>Explore our premium selection of aircraft available for sale.</p>
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

      <button className="button">View More</button>
    </section>
  );
};

export default Class_section;
