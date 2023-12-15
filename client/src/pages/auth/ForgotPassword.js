import { useEffect, useState } from "react";
import styles from "./auth.module.scss";
import loginImg from "../../assets/login.png";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail } from "../../utils";
import { RESET_AUTH, login } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isLoggedIn } = useSelector((state) => state.auth);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please Enter Email");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    console.log({ email });
  };

  useEffect(() => {
    return () => {
      dispatch(RESET_AUTH());
    };
  }, [dispatch]);

  return (
    <>
      {isLoading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <div className={styles.img}>
          <img src={loginImg} alt="Login" width="400" />
        </div>
        <Card>
          <div className={styles.form}>
            <h2>Enter Email To Reset Password.</h2>
            <form onSubmit={handleReset}>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button type="submit" className="--btn --btn-primary --btn-block">
                Reset
              </button>
            </form>

            <div class="text-sm mt-2">
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 ml-[15%]"
              >
                Back To LogIn?
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
};

export default ForgotPassword;
