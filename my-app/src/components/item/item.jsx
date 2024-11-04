import React, { useEffect, useState } from 'react';
import Header from '../header/header.jsx';
import Footer from '../footer/footer.jsx';
import { useParams, Link} from 'react-router-dom';
import './item.css';

const ItemPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const items = [
      { id: 1, img: '/img/Airbus A220.jpg', name: 'Airbus A220', price: '$10' },
      { id: 2, img: '/img/Boeing 737.jpg', name: 'Boeing 737', price: '$15' },
      { id: 3, img: '/img/Boeing 777.jpg', name: 'Boeing 777', price: '$20' },
      { id: 4, img: '/img/tapok.jpg', name: 'Tapok', price: '$100' },
    ];
    const selectedItem = items.find(item => item.id === parseInt(id));
    setItem(selectedItem);
  }, [id]);

  if (!item) return <p>Loading...</p>;

  return (
    <div>
      <Header />
      <section id="item_s" className="item-page-container">
        <div className="item-content">
          <img src={item.img} alt={item.name} className="item-image" />
          <div className="item-details">
            <h1>{item.name}</h1>
            <p className="item-page-price">{item.price}</p>
            <div className="button-container">
              <Link to="/catalog">
                <button className="button">Back</button>
              </Link>
              <button className="button">Add to Cart</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ItemPage;
