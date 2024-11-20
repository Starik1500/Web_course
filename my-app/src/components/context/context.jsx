import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchItems } from '../../api.js';

export const ItemContext = createContext();

export const useItemContext = () => {
    return useContext(ItemContext);
};

export const ItemProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [priceFilter, setPriceFilter] = useState('price');
    const [categoryFilter, setCategoryFilter] = useState('category');
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const getItems = async (filters = {}) => {
      setIsLoading(true);
      try {
          const items = await fetchItems({searchText: filters.searchText || searchText,
            priceFilter: filters.priceFilter || priceFilter,
            categoryFilter: filters.categoryFilter || categoryFilter}); 
          setItems(items);
          setFilteredItems(items); 
      } catch (error) {
          console.error('Error loading items:', error);
      } finally {
          setIsLoading(false);
      }
  };

    useEffect(() => {
        getItems();
    }, []);

    const handleSearch = (text) => {
        setSearchText(text.trim().toLowerCase());
        getItems();
    };

    const applyFilters = () => {
        getItems();
    };

    return (
        <ItemContext.Provider value={{
            items,
            filteredItems,
            setFilteredItems,
            priceFilter,
            setPriceFilter,
            categoryFilter,
            setCategoryFilter,
            handleSearch,
            applyFilters,
            isLoading
        }}>
            {children}
        </ItemContext.Provider>
    );
};
