import React, { useContext, useState, useEffect } from 'react';
import PrimaryButton from '../../primarybutton/primary_button';
import Select from '../../select/select';
import Header from '../../header/header.jsx';
import Footer from '../../footer/footer.jsx';
import { ItemContext } from '../../context/context.jsx';
import ItemList from '../../itemlist/itemlist.jsx';
import axios from 'axios';
import './catalog.css';

const CatalogPage = () => {
    const {
        filteredItems,
        setFilteredItems,
        priceFilter,
        setPriceFilter,
        categoryFilter,
        setCategoryFilter,
        handleSearch,
        applyFilters,
        isLoading,
    } = useContext(ItemContext);

    const [showSpinner, setShowSpinner] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const token = localStorage.getItem('authToken'); 

    useEffect(() => {
        const fetchFilteredItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/planes', {
                    headers: { Authorization: `Bearer ${token}` }, 
                    params: {
                        searchText: '',
                        priceFilter,
                        categoryFilter,
                    },
                });
                setFilteredItems(response.data);
            } catch (error) {
                console.error('Помилка завантаження даних:', error);
                setErrorMessage('Не вдалося завантажити дані. Перевірте ваше підключення або увійдіть повторно.');
            }
        };

        if (token) {
            fetchFilteredItems();
        } else {
            setErrorMessage('Ви не авторизовані. Будь ласка, увійдіть.');
        }
    }, [priceFilter, categoryFilter, token, setFilteredItems]);

    useEffect(() => {
        let timer;

        if (isLoading) {
            setShowSpinner(true);
            timer = setTimeout(() => {
                setShowSpinner(false);
            }, 1500);
        } else {
            timer = setTimeout(() => {
                setShowSpinner(false);
            }, 500);
        }

        return () => clearTimeout(timer);
    }, [isLoading]);

    const handlePriceFilterChange = (event) => setPriceFilter(event.target.value);

    const handleCategoryFilterChange = (event) => {
        const selectedCategory = event.target.value;
        if (selectedCategory === 'All category') {
            setCategoryFilter('');
        } else {
            setCategoryFilter(selectedCategory);
        }

        applyFilters();
    };

    const categories = ['All category', 'Military', 'Commercial', 'Vintage', 'Regional', 'Long Haul'];

    return (
        <div className="catalog">
            <Header onSearch={(e) => handleSearch(e.target.value)} />

            <div className="filter-header">
                <div className="select-container">
                    <Select
                        options={['price', 'Low to High', 'High to Low']}
                        onChange={handlePriceFilterChange}
                        value={priceFilter}
                    />
                    <Select
                        options={categories}
                        onChange={handleCategoryFilterChange}
                        value={categoryFilter}
                    />
                    <PrimaryButton label="Apply" onClick={applyFilters} />
                </div>
            </div>

            {errorMessage ? (
                <div className="error-message">{errorMessage}</div>
            ) : showSpinner ? (
                <div className="loader">Loading...</div>
            ) : (
                <ItemList items={filteredItems} />
            )}

            <Footer />
        </div>
    );
};

export default CatalogPage;
