import React from 'react';
import logo from './logo.svg';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { Filter } from './components/Filter';


function App() {
  return (
    <div>
        <Header/>
        <Filter/>
        <ProductList/>
    </div>
  );
}

export default App;
