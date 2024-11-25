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
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const token = localStorage.getItem('authToken'); 

  useEffect(() => {
    if (!token) {
      setError('User not logged in. Please log in to view your cart.');
      setLoading(false);
      return;
    }

    const fetchCartItems = async () => {
      try {
        await dispatch(fetchCart(token)); 
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setError('Failed to fetch cart. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [dispatch, token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleRemoveFromCart = async (id) => {
    if (!token) {
        alert('You must be logged in to remove items from the cart.');
        return;
    }

    try {
        await dispatch(removeFromCartApi(token, id));
    } catch (err) {
        console.error('Failed to remove item from cart:', err);
    }
};

  const handleQuantityChange = async (id, quantity) => {
    if (!token) {
        alert('You must be logged in to update item quantity.');
        return;
    }

    try {
        await dispatch(updateQuantityApi(token, id, quantity));
    } catch (err) {
        console.error('Failed to update item quantity:', err);
    }
};

  const handleContinue = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before proceeding.');
      return;
    }
    navigate('/checkout');
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
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      max="10"
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    />
                  </label>
                  <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
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
        <button onClick={handleContinue} className="button">
          Continue
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
