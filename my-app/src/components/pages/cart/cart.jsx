import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCartApi, updateQuantityApi, fetchCart } from '../../../redux/actions.js';
import Header from '../../header/header.jsx';
import Footer from '../../footer/footer.jsx';
import './cart.css';

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = 1;
    const fetchCartItems = async () => {
      try {
        await dispatch(fetchCart(userId)); 
      } catch (err) {
        setError('Failed to fetch cart');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCartItems();
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleRemoveFromCart = (id) => {
    const userId = 1; 
    dispatch(removeFromCartApi(userId, id));
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) {
      handleRemoveFromCart(id);
      return;
    }

    if (quantity > 10) {
      alert('Maximum quantity is 10');
      return;
    }

    const userId = 1; 
    dispatch(updateQuantityApi(userId, id, quantity));
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="cart">
      <Header />
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.img} alt={item.name} />
                <h2>{item.name}</h2>
                <p>{item.selected_option} mode</p>
                <div>
                  <label>
                    Quantity:
                    <input type="number" value={item.quantity} min="1" max = "10"
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}/>
                  </label>
                  <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                </div>
                <p>${ (item.price * item.quantity).toFixed(2) }</p>
              </li>
            ))}
          </ul>
        )}
        {cartItems.length > 0 && (
          <div className="cart-summary">
            <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
          </div>
        )}
      </div>
      <div className="cart-button-container">
          <button onClick={() => navigate(-1)} className="button">
              Back
            </button>
            <button className="button">Continue</button>
          </div>
      <Footer />
    </div>
  );
};

export default CartPage;
