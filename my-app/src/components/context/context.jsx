import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

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

    const getItems = useCallback(async (filters = {}) => {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
    
        if (!token) {
            console.error('Токен відсутній');
            throw new Error('Користувач неавторизований.');
        }
    
        try {
            const response = await axios.get('http://localhost:5000/api/planes', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    searchText: filters.searchText || searchText,
                    priceFilter: filters.priceFilter || priceFilter,
                    categoryFilter: filters.categoryFilter || categoryFilter,
                },
            });
    
            const items = response.data;
            setItems(items);
            setFilteredItems(items);
        } catch (error) {
            console.error('Помилка завантаження даних:', error);
    
            if (error.response?.status === 403) {
                console.error('Токен недійсний або прострочений. Видалення токена...');
                localStorage.removeItem('authToken');
                window.location.href = '/login'; 
            }
        } finally {
            setIsLoading(false);
        }
    }, [searchText, priceFilter, categoryFilter]);
    

    useEffect(() => {
        getItems();
    }, [getItems]);

    const handleSearch = (text) => {
        setSearchText(text.trim().toLowerCase());
        getItems();
    };

    const applyFilters = () => {
        getItems();
    };

    return (
        <ItemContext.Provider
            value={{
                items,
                filteredItems,
                setFilteredItems,
                priceFilter,
                setPriceFilter,
                categoryFilter,
                setCategoryFilter,
                handleSearch,
                applyFilters,
                isLoading,
            }}
        >
            {children}
        </ItemContext.Provider>
    );
};
