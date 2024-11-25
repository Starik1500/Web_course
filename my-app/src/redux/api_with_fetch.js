const BASE_URL = 'http://localhost:5000/api/cart';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
};

export const addToCartRequest = async (cartItem) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: getAuthHeaders(), 
    body: JSON.stringify(cartItem),
  });
  return response;
};

export const updateQuantityRequest = async (token, id, quantity) => {
  const response = await fetch(`http://localhost:5000/api/cart/${id}`, {
      method: 'PUT',
      headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
  });
  return response;
};


export const clearCartRequest = async (user_adress) => {
  const response = await fetch(`${BASE_URL}/clear/${user_adress}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return response;
};

export const removeFromCartRequest = async (token, id) => {
  const response = await fetch(`http://localhost:5000/api/cart/${id}`, {
      method: 'DELETE',
      headers: {
          Authorization: `Bearer ${token}`,
      },
  });
  return response;
};

export const fetchCartRequest = async (token) => {
  const response = await fetch(`http://localhost:5000/api/cart/${token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
  });
  return response;
};
