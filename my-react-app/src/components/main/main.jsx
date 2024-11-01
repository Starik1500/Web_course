import React from 'react';
import './main.css';

const Main_section = () => {
  return (
    <section id="main_s">
      <img 
        src="/img/Main_aircraft.jpg" 
        alt="placeholder" 
        className="image" 
      />
      <div className="text-container">
        <h1>Welcome to Our Aircraft Sales</h1>
        <p>We provide a wide range of aircraft tailored for your airline's needs.
          From small regional jets to large commercial airliners, we have the right solution for you.
          Explore our catalog and find the perfect aircraft for your operations.</p>
      </div>
    </section>
  );
};

export default Main_section;
