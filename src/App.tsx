import { Header } from "./components/Header";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Product } from "./pages/product";
import { Cart } from "./pages/cart";
import { LandingPage } from "./pages/landingpage";
// import { ResetPassword } from "./pages/ResetPassword";
import { PaymentConfirmation } from "./pages/paymentconfirmation";
import { Order } from "./pages/orders";
import { BuyProductCart } from "./pages/buyproductcart";
import { PageNotFound } from "./shared/components/PageNotFound";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/productlist" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/buyproduct" element={<BuyProductCart />} />

          {/* <Route path="/reset-password" element={<ResetPassword/>}/> */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="/payment" element={<PaymentConfirmation />} />
        <Route path="/orders" element={<Order />} />
        <Route path="*" element={<PageNotFound />} />
        {/* <Route path="/product" element={<Product/> } />  */}
      </Routes>
    </div>
  );
}

export default App;
