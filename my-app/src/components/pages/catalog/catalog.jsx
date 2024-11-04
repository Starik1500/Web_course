import React, { useContext } from 'react';
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
  } = useContext(ItemContext);

  const handlePriceFilterChange = (event) => setPriceFilter(event.target.value);
  const handleCategoryFilterChange = (event) => setCategoryFilter(event.target.value);

  const categories = ['category', ...new Set(filteredItems.map(item => item.category))];

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

      <ItemList items={filteredItems} />

      <Footer />
    </div>
  );
};

export default CatalogPage;
