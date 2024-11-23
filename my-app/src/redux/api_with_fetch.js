export const API_HOST = 'http://localhost:5000';

export const addToCartApi = async (cartItem) => {
  try {
    console.log('Sending cartItem:', cartItem);
    const response = await fetch(`${API_HOST}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartItem),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error adding item to cart:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

export const updateQuantityApi = async (user_id, id, quantity) => {
  if (quantity < 1 || quantity > 10) {
    throw new Error('Quantity must be between 1 and 10');
  }

  try {
    const response = await fetch(`${API_HOST}/api/cart/${user_id}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error updating quantity:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    throw error;
  }
};

export const clearCartApi = async (user_adress) => {
  try {
    const response = await fetch(`${API_HOST}/api/cart/clear/${user_adress}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to clear cart');
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

export const removeFromCartApi = async (user_adress, id) => {
  try {
    const response = await fetch(`${API_HOST}/api/cart/${user_adress}/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error removing item from cart:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

export const fetchCartApi = async (user_adress) => {
  try {
    const response = await fetch(`${API_HOST}/api/cart/${user_adress}`);
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error fetching cart:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

