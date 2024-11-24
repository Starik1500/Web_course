const BASE_URL = 'http://localhost:5000/api/cart';

export const addToCartRequest = async (cartItem) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cartItem),
  });
  return response;
};

export const updateQuantityRequest = async (user_id, id, quantity) => {
  const response = await fetch(`${BASE_URL}/${user_id}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  return response;
};

export const clearCartRequest = async (user_adress) => {
  const response = await fetch(`${BASE_URL}/clear/${user_adress}`, {
    method: 'DELETE',
  });
  return response;
};

export const removeFromCartRequest = async (user_adress, id) => {
  const response = await fetch(`${BASE_URL}/${user_adress}/${id}`, {
    method: 'DELETE',
  });
  return response;
};

export const fetchCartRequest = async (user_adress) => {
  const response = await fetch(`${BASE_URL}/${user_adress}`);
  return response;
};
