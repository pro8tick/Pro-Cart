import { useState } from "react";
import styles from "./Header.module.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTimes, FaUserCircle } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { RESET_AUTH, logout } from "../../redux/features/auth/authSlice";
import {
  ShowOnAdmin,
  ShowOnLogOut,
  ShowOnLogin,
} from "../hiddenLink/ShowOnLogin";
import { UserName } from "../../pages/profile/Profile";
import { selectItems } from "../../redux/features/cart/cartSlice";
export const logo = (
  <div className={styles.logo}>
    <Link to="/">
      <h2>
        Pro-cart<span>Nation</span>
      </h2>
    </Link>
  </div>
);

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");

const Header = () => {
  const [showMenu, setshowMenu] = useState(false);
  const [scroll, setScroll] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectItems);
  const fixedNavbar = () => {
    if (window.scrollY > 800) {
      setScroll(false);
    } else {
      setScroll(true);
    }
  };

  window.addEventListener("scroll", fixedNavbar);

  const toggelMenu = () => {
    setshowMenu(!showMenu);
  };
  const hideMenu = () => {
    setshowMenu(false);
  };

  const logoutUser = async () => {
    await dispatch(logout());
    await dispatch(RESET_AUTH());
    navigate("/login");
  };

  const cart = (
    <span className={styles.cart}>
      <Link to="/cart">
        Cart
        <FaShoppingCart size={20} />
        {items.length > 0 && <p>{items.length}</p>}
      </Link>
    </span>
  );

  return (
    <header className={scroll ? "" : `${styles.move}`}>
      <div className={styles.header}>
        <div className={styles.admin}>
          {logo}
          <ShowOnAdmin>
            <Link to="/admin/orders" className={activeLink}>
              Orders
            </Link>
            <Link to="/admin" className={activeLink}>
              Products
            </Link>
          </ShowOnAdmin>
        </div>

        <nav
          className={
            showMenu ? `${styles["show-nav"]}` : `${styles["hide-nav"]}`
          }
        >
          <div
            className={
              showMenu
                ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}`
                : `${styles["nav-wrapper"]}`
            }
            onClick={hideMenu}
          ></div>
          <ul>
            <li className={styles["logo-mobile"]}>
              {logo}
              <FaTimes size={22} color="#fff" onClick={hideMenu} />
            </li>
            <li>
              <NavLink to="/shop" className={activeLink}>
                Shop
              </NavLink>
            </li>
          </ul>
          <div className={styles["header-right"]}>
            <span className={styles.links}>
              <ShowOnLogin>
                <NavLink to="/profile" className={activeLink}>
                  <FaUserCircle size={16} color="#ff7722" />
                  <UserName />
                </NavLink>
              </ShowOnLogin>
              <ShowOnLogOut>
                <NavLink to="/login" className={activeLink}>
                  Login
                </NavLink>
              </ShowOnLogOut>
              <ShowOnLogOut>
                <NavLink to="/register" className={activeLink}>
                  Register
                </NavLink>
              </ShowOnLogOut>
              <ShowOnLogin>
                <NavLink to="/order-history" className={activeLink}>
                  My Order
                </NavLink>
              </ShowOnLogin>
              <ShowOnLogin>
                <Link to="/" onClick={logoutUser}>
                  Logout
                </Link>
              </ShowOnLogin>
            </span>
            <ShowOnLogin>{cart}</ShowOnLogin>
          </div>
        </nav>
        <div className={styles["menu-icon"]}>
          <ShowOnLogin>{cart}</ShowOnLogin>
          <HiOutlineMenuAlt3 size={28} onClick={toggelMenu} />
        </div>
      </div>
    </header>
  );
};

export default Header;
