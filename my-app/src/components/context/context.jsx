import React, { createContext, useState, useContext } from 'react';

export const ItemContext = createContext();

export const useItemContext = () => {
    return useContext(ItemContext); 
  };

export const ItemProvider = ({ children }) => {
  const initialItems = [
    { id: 1, img: '/img/Airbus A220.jpg', name: 'Airbus A220', price: '$10', category: 'Regional' },
    { id: 2, img: '/img/Boeing 737.jpg', name: 'Boeing 737', price: '$15', category: 'Commercial' },
    { id: 3, img: '/img/Boeing 777.jpg', name: 'Boeing 777', price: '$20', category: 'Commercial' },
    { id: 4, img: '/img/tapok.jpg', name: 'Tapok', price: '$100', category: 'Military' },
  ];

  const [items] = useState(initialItems);
  const [filteredItems, setFilteredItems] = useState(initialItems);
  const [priceFilter, setPriceFilter] = useState('price');
  const [categoryFilter, setCategoryFilter] = useState('category');

  const handleSearch = (searchText) => {
    const filtered = items.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredItems(filtered);
  };

  const applyFilters = () => {
    let newFilteredItems = [...items];

    if (categoryFilter && categoryFilter !== 'category') {
      newFilteredItems = newFilteredItems.filter(item => item.category === categoryFilter);
    }

    if (priceFilter && priceFilter !== 'price') {
      newFilteredItems.sort((a, b) => 
        priceFilter === 'Low to High'
          ? parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1))
          : parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1))
      );
    }

    setFilteredItems(newFilteredItems);
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
      applyFilters
    }}>
      {children}
    </ItemContext.Provider>
  );
};
