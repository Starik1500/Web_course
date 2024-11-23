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
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.userId : null;

  useEffect(() => {
    if (!userId) {
      setError('User not logged in. Please log in to view your cart.');
      setLoading(false);
      return;
    }

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
  }, [dispatch, userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleRemoveFromCart = (id) => {
    if (!userId) {
      alert('You must be logged in to remove items from the cart.');
      return;
    }
    dispatch(removeFromCartApi(userId, id));
  };

  const handleQuantityChange = (id, quantity) => {
    if (!userId) {
      alert('You must be logged in to update item quantity.');
      return;
    }
    
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
            <button onClick={handleContinue} className="button">Continue</button>
          </div>
      <Footer />
    </div>
  );
};

export default CartPage;
