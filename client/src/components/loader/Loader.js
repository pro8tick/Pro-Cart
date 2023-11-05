import styles from "./Loader.module.scss";
import { createPortal } from "react-dom";
import loaderImg from "../../assets/loader.gif";

const Loader = () => {
  return createPortal(
    <div className={styles.wrapper}>
      <div className={styles.loader}>
        <img src={loaderImg} alt="loading" />
      </div>
    </div>,
    document.getElementById("loader")
  );
};

export const Spinner = () => {
  return (
    <div className="--center-all">
      <img src={loaderImg} alt="loading" />
    </div>
  );
};
export default Loader;
