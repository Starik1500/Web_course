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
      const updatedCart = await response.json(); 
      dispatch({ type: FETCH_CART, payload: updatedCart }); 
      console.log('Item added and cart updated:', updatedCart);
    } else {
      const errorData = await response.json();
      console.error('Error adding item to cart:', errorData.error || response.statusText);
      alert('Failed to add item to cart: ' + (errorData.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    alert('An error occurred while adding the item to the cart.');
  }
};


export const updateQuantityApi = (token, id, quantity) => async (dispatch) => {
  if (quantity < 1) {
    alert('Quantity must be at least 1');
    return;
  }
  if (quantity > 10) {
    alert('Maximum quantity is 10');
    return;
  }

  try {
    const response = await updateQuantityRequest(token, id, quantity);

    if (response.ok) {
      const data = await response.json();
      dispatch(updateQuantity(id, quantity));
      console.log('Quantity updated successfully:', data);
    } else {
      const errorData = await response.json();
      console.error('Error updating quantity:', errorData.error || response.statusText);
      alert('Failed to update quantity: ' + (errorData.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    alert('An error occurred while updating the quantity.');
  }
};

export const clearCart = (token) => async (dispatch) => {
  if (!token) {
    console.error('No token provided. Cannot clear cart.');
    alert('Authentication token is missing. Please log in.');
    return;
  }

  try {
    console.log('Clearing cart with token:', token);
    const response = await clearCartRequest(token);

    if (response.ok) {
      dispatch({ type: CLEAR_CART });
      console.log('Cart cleared in database and Redux');
    } else {
      const errorData = await response.json();
      console.error('Error clearing cart:', errorData.error || response.statusText);
      alert('Failed to clear cart: ' + (errorData.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    alert('An error occurred while clearing the cart.');
  }
};

export const removeFromCartApi = (token, id) => async (dispatch) => {
  try {
    const response = await removeFromCartRequest(token, id);

    if (response.ok) {
      dispatch(removeFromCart(id));
      console.log('Item removed from cart:', id);
    } else {
      const errorData = await response.json();
      console.error('Error removing item from cart:', errorData.error || response.statusText);
      alert('Failed to remove item: ' + (errorData.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    alert('An error occurred while removing the item.');
  }
};

export const fetchCart = (token) => async (dispatch) => {
  try {
    const response = await fetchCartRequest(token);

    if (response.ok) {
      const cartItems = await response.json();
      dispatch({ type: FETCH_CART, payload: cartItems });
    } else {
      const errorData = await response.json();
      console.error('Error fetching cart:', errorData.error || response.statusText);
      alert('Failed to fetch cart: ' + (errorData.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    alert('An error occurred while fetching the cart.');
  }
};
