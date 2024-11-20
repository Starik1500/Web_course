import axios from 'axios';

const API_URL = 'http://localhost:5000/api/planes';

export const fetchItems = async ({ searchText = '', priceFilter = 'price', categoryFilter = 'category' }) => {
  try {
      const response = await axios.get(API_URL, {
          params: { searchText, priceFilter, categoryFilter } 
      });
      return response.data; 
  } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
  }
};

export const fetchItemById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

