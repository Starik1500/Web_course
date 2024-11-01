import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Catalog_page from './components/pages/catalog/catalog.jsx';
import Home_page from './components/pages/home/home.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home_page />} />
          <Route path="/home" element={<Home_page />} />
          <Route path="/catalog" element={<Catalog_page/>} />
          <Route path="/cart" element={<Catalog_page/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
