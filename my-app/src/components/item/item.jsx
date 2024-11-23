import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../header/header.jsx';
import Footer from '../footer/footer.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import { addToCartApi } from '../../redux/actions.js'; 
import './item.css';
import { fetchItemById } from '../../api.js';

const ItemPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const [item, setItem] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const [selectedOption, setSelectedOption] = useState('white');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.userId : null;

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await fetchItemById(id);
        const priceValue = parseFloat(data.price) || 0;
        setItem(data);
        setError(null);
        setTotalPrice(priceValue);
      } catch (error) {
        setError('Item not found or an error occurred while fetching data.');
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value)  || 1;
    setQuantity(newQuantity);
    if (item) {
      const itemPrice = parseFloat(item.price) || 0;
      setTotalPrice(itemPrice * newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!userId) {
      alert('You must be logged in to add items to the cart.');
      navigate('/login');
      return;
    }
    
    if (item) {
      const currentCartQuantity = cart.reduce((total, cartItem) => {
        return cartItem.item_id === item.id && cartItem.selected_option === selectedOption
          ? total + cartItem.quantity
          : total;
      }, 0);

      if (currentCartQuantity + quantity > 10) {
        alert('Cannot add more than 10 items of this product to the cart.');
        return;
      }

      const cartItem = {
        user_adress: userId,
        item_id: item.id,
        quantity,
        selected_option: selectedOption,
      };

      if (cartItem.quantity > 10) {
        alert('Quantity cannot exceed 10 items');
        return;
      }
      
      dispatch(addToCartApi(cartItem)); 
      alert('Item added to cart!');
    }
  };

  if (loading) return <p>Loading...</p>; 
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header />
      <section id="item_s" className="item-page-container">
        <div className="item-content">
          <img src={item.img} alt={item.name} className="item-image" />
          <div className="item-details">
            <h1>{item.name}</h1>
            <p className="item-page-price">Price: ${totalPrice.toFixed(2)}</p>
            
            <div className="select-container">
              <label htmlFor="option-select">Item mode:</label>
              <select id="option-select" value={selectedOption} onChange={handleOptionChange}>
                <option value="white">White</option>
                <option value="nigga">Nigga</option>
              </select>
            </div>
            
            <div className="select-container">
              <label htmlFor="quantity-select">Quantity:</label>
              <select id="quantity-select" value={quantity} onChange={handleQuantityChange}>
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>{num + 1}</option>
                ))}
              </select>
            </div>

            <div className="button-container">
            <button onClick={() => navigate(-1)} className="button">
                Back
              </button>
              <button onClick={handleAddToCart} className="button">Add to Cart</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ItemPage;