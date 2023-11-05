import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Login from "./pages/auth/Login.js";
import Register from "./pages/auth/Register.js";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getLoginStatus } from "./redux/features/auth/authSlice";
import Profile from "./pages/profile/Profile.js";
import ProductList from "./components/productList.js/productList";
import Shop from "./pages/shop/shop";

const App = () => {
  axios.defaults.withCredentials = true;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
