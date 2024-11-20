import React, { useContext, useState, useEffect, useMemo } from 'react';
import PrimaryButton from '../../primarybutton/primary_button';
import Select from '../../select/select';
import Header from '../../header/header.jsx';
import Footer from '../../footer/footer.jsx';
import { ItemContext } from '../../context/context.jsx';
import ItemList from '../../itemlist/itemlist.jsx';
import './catalog.css';

const CatalogPage = () => {
    const {
        filteredItems,
        priceFilter,
        setPriceFilter,
        categoryFilter,
        setCategoryFilter,
        handleSearch,
        applyFilters,
        isLoading 
    } = useContext(ItemContext);

    const [showSpinner, setShowSpinner] = useState(false);

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

            {showSpinner ? (
                <div className="loader">Loading...</div>
            ) : (
                <ItemList items={filteredItems} />
            )}

            <Footer />
        </div>
    );
};

export default CatalogPage;
