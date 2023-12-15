import { useEffect, useState } from "react";
import styles from "./auth.module.scss";
import loginImg from "../../assets/login.png";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RESET_AUTH, register } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

const initialstate = {
  name: "",
  email: "",
  password: "",
  confirmpassword: "",
};
const Register = () => {
  const [formData, setFormData] = useState(initialstate);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, email, password, confirmpassword } = formData;
  const { isLoading, isLoggedIn } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("All fields are required");
    }
    if (password.length < 6) {
      return toast.error("password must be up to 6 characters");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    if (password !== confirmpassword) {
      return toast.error("Password doesn't match");
    }
    const userData = {
      name,
      email,
      password,
    };

    await dispatch(register(userData));
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
      dispatch(RESET_AUTH());
    }
  }, [isLoggedIn, dispatch, navigate]);

  return (
    <>
      {isLoading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <Card>
          <div className={styles.form}>
            <h2>Register</h2>
            <form onSubmit={registerUser}>
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                value={name}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                value={password}
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="confirm password"
                required
                name="confirmpassword"
                value={confirmpassword}
                onChange={handleInputChange}
              />
              <button type="submit" className="--btn --btn-primary --btn-block">
                Register
              </button>
            </form>
            <span className={styles.register}>
              <p>Already have an account?</p>
              <Link to="/login">Login</Link>
            </span>
          </div>
        </Card>
        <div className={styles.img}>
          <img src={loginImg} alt="Login" width="400" />
        </div>
      </section>
    </>
  );
};

export default Register;
