import {
  addToCartRequest,
  updateQuantityRequest,
  clearCartRequest,
  removeFromCartRequest,
  fetchCartRequest,
} from './api_with_fetch';

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
export const FETCH_CART = 'FETCH_CART';
export const CLEAR_CART = 'CLEAR_CART';

export const addToCart = (cartItem) => ({
  type: ADD_TO_CART,
  payload: cartItem,
});

export const removeFromCart = (id) => ({
  type: REMOVE_FROM_CART,
  payload: id,
});

export const updateQuantity = (id, quantity) => ({
  type: UPDATE_QUANTITY,
  payload: { id, quantity },
});

export const addToCartApi = (cartItem) => async (dispatch) => {
  try {
    console.log('Sending cartItem:', cartItem);
    const response = await addToCartRequest(cartItem);

    if (response.ok) {
      const data = await response.json();
      dispatch(addToCart(cartItem));
      console.log('Item added to database and Redux:', data);
    } else {
      console.error('Error adding item to cart:', response.statusText);
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
  }
};

export const updateQuantityApi = (user_id, id, quantity) => async (dispatch) => {
  if (quantity < 1) {
    alert('Quantity must be at least 1');
    return;
  }
  if (quantity > 10) {
    alert('Maximum quantity is 10');
    return;
  }

  try {
    const response = await updateQuantityRequest(user_id, id, quantity);

    if (response.ok) {
      const data = await response.json();
      dispatch(updateQuantity(id, quantity));
      console.log('Quantity updated successfully:', data);
    } else {
      console.error('Error updating quantity:', response.statusText);
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
  }
};

export const clearCart = (user_adress) => async (dispatch) => {
  console.log('Received user_adress:', user_adress);
  if (!user_adress || isNaN(user_adress)) {
    console.error('Invalid user_adress:', user_adress);
    alert('Invalid user address provided.');
    return;
  }
  try {
    console.log('Clearing cart for user_adress:', user_adress);
    const response = await clearCartRequest(user_adress);

    if (response.ok) {
      dispatch({ type: CLEAR_CART });
      console.log('Cart cleared in database and Redux');
    } else {
      const errorData = await response.json();
      console.error('Error clearing cart:', response.statusText);
      alert('Failed to clear cart: ' + (errorData.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    alert('An error occurred while clearing the cart.');
  }
};

export const removeFromCartApi = (user_adress, id) => async (dispatch) => {
  try {
    const response = await removeFromCartRequest(user_adress, id);

    if (response.ok) {
      dispatch(removeFromCart(id));
      console.log('Item removed from cart');
    } else {
      console.error('Error removing item from cart:', response.statusText);
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
  }
};

export const fetchCart = (user_adress) => async (dispatch) => {
  try {
    const response = await fetchCartRequest(user_adress);

    if (response.ok) {
      const cartItems = await response.json();
      dispatch({ type: FETCH_CART, payload: cartItems });
    } else {
      console.error('Error fetching cart:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
  }
};
