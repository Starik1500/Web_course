import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import Catalog_page from './components/pages/catalog/catalog.jsx';
import Cart_page from './components/pages/cart/cart.jsx';
import Home_page from './components/pages/home/home.jsx';
import CheckoutPage from './components/checkout/checkout.jsx';
import SuccessPage from './components/pages/success/success.jsx';
import ItemPage from './components/item/item.jsx';
import { ItemProvider } from './components/context/context.jsx';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ItemProvider>
          <Routes>
            <Route exact path="/" element={<Home_page />} />
            <Route path="/home" element={<Home_page />} />
            <Route path="/catalog" element={<Catalog_page/>} />
            <Route path="/item/:id" element={<ItemPage />} />
            <Route path="/cart" element={<Cart_page/>} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </ItemProvider>
      </Router>
    </Provider>
  );
}

export default App;
