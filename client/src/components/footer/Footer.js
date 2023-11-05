import React from "react";
import styles from "./Footer.module.scss";
function Footer() {
  const year = new Date().getFullYear();
  return <div className={styles.footer}>&copy; {year} ALL Rights Reserved</div>;
}

export default Footer;
