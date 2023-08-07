import React from "react";
import logo from "./logo.svg";
import { Header } from "./components/Header";
import { ProductList } from "./components/ProductList";
import { Filter } from "./components/Filter";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Product } from "./pages/product";
import { Cart } from "./pages/cart";
import { LandingPage } from "./pages/landingpage";
import { ResetPassword } from "./pages/ResetPassword";
import { PaymentConfirmation } from "./pages/paymentconfirmation";
// import PaymentConfirmation from "./pages/pa"
// import {PaymentConfirmation} from "./pages/PaymentConfirmation"
// import { Home } from './pages/home/home';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<PaymentConfirmation/>} />
          {/* <Route path="/reset-password" element={<ResetPassword/>}/> */}
        </Route>
        {/* <Route path="/product" element={<Product/> } />  */}
      </Routes>
    </div>
  );
}

export default App;
