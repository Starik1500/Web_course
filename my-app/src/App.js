import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Catalog_page from './components/pages/catalog/catalog.jsx';
import Home_page from './components/pages/home/home.jsx';
import ItemPage from './components/item/item.jsx';
import { ItemProvider } from './components/context/context.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <ItemProvider>
        <Routes>
          <Route exact path="/" element={<Home_page />} />
          <Route path="/home" element={<Home_page />} />
          <Route path="/catalog" element={<Catalog_page/>} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/cart" element={<Catalog_page/>} />
        </Routes>
      </ItemProvider>
    </Router>
  );
}

export default App;
