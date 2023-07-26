import React from 'react';
import logo from './logo.svg';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { Filter } from './components/Filter';
import {Routes , Route } from "react-router-dom" 
import { Home } from './pages/home';
import { Product } from './pages/product';
import { Cart } from './pages/cart';
// import { Home } from './pages/home/home';


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Header/> } >
            <Route path="/" element={<Home/> } />
            <Route path="/product" element={<Product/> } />  
            <Route path="/cart" element={<Cart/> } />  
        </Route>
        {/* <Route path="/product" element={<Product/> } />  */}
      </Routes>
    </div>
  );
}

export default App;
