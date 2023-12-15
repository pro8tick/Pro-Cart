import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Login from "./pages/auth/Login.js";
import Register from "./pages/auth/Register.js";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getLoginStatus,
  getUser,
  selectCheck,
  selectCheckUser,
  selectUser,
} from "./redux/features/auth/authSlice";
import Profile from "./pages/profile/Profile.js";
import Shop from "./pages/shop/shop";
import CartPage from "./pages/cart/CartPage";
import CheckOut from "./pages/checkout/CheckOut";
import ProductDetails from "./components/productList/ProductDetails";
import Protected from "./components/protected/Protected.js";
import { fetchCartProductsAsync } from "./redux/features/cart/cartSlice.js";
import ErrorPsge from "./pages/404.js";
import OrderSuccessPage from "./pages/order/OrderSuccess.js";
import MyOrder from "./pages/order/MyOrder.js";
import ForgotPassword from "./pages/auth/ForgotPassword.js";
import ProtectedAdmin from "./components/protected/ProtectedAdmin.js";
import AdminHome from "./pages/admin/AdminHome.js";
import AdminProductDetailsPage from "./pages/admin/AdminProductDetails.js";
import ProductForm from "./components/Admin/ProductForm.js";
import AdminOrders from "./pages/admin/AdminOrders.js";
import StripeCheckout from "./pages/checkout/StripeCheckout.js";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const checked = useSelector(selectCheck);

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(getUser());
      dispatch(fetchCartProductsAsync());
    }
  }, [dispatch, user]);

  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <div className="app-container">
          <Header />
          {checked && (
            <div className="main-content">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Protected>
                      <Home />
                    </Protected>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdmin>
                      <AdminHome />
                    </ProtectedAdmin>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/profile"
                  element={
                    <Protected>
                      <Profile />
                    </Protected>
                  }
                />
                <Route
                  path="/stripe-checkout"
                  element={
                    <Protected>
                      <StripeCheckout />
                    </Protected>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <Protected>
                      <Shop />
                    </Protected>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <Protected>
                      <CartPage />
                    </Protected>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <Protected>
                      <CheckOut />
                    </Protected>
                  }
                />
                <Route
                  path="/product-details/:id"
                  element={
                    <Protected>
                      <ProductDetails />
                    </Protected>
                  }
                />
                <Route
                  path="/admin/product-details/:id"
                  element={
                    <ProtectedAdmin>
                      <AdminProductDetailsPage />
                    </ProtectedAdmin>
                  }
                />
                <Route
                  path="/admin/product-form"
                  element={
                    <ProtectedAdmin>
                      <ProductForm />
                    </ProtectedAdmin>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedAdmin>
                      <AdminOrders />
                    </ProtectedAdmin>
                  }
                />
                <Route
                  path="/admin/product-form/edit/:id"
                  element={
                    <ProtectedAdmin>
                      <ProductForm />
                    </ProtectedAdmin>
                  }
                />
                <Route
                  path="/order-success/:id"
                  element={
                    <Protected>
                      <OrderSuccessPage />
                    </Protected>
                  }
                />
                <Route
                  path="/order-history"
                  element={
                    <Protected>
                      <MyOrder />
                    </Protected>
                  }
                />

                <Route path="*" element={<ErrorPsge />} />
              </Routes>
            </div>
          )}
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
