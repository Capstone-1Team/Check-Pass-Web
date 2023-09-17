import LoginForm from "../Components/LoginPage/LoginForm";
import styles from "../Styles/Pages/LoginPage/_loginPage.module.scss";
import sunIcon from "../Assets/Image/sun.png";
import moonIcon from "../Assets/Image/moon.png";
import { useState } from "react";
import { useTheme } from "../Contexts/DarkModeContext";

const LoginPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  };

  return (
    <div className={isDarkMode ? `${styles.dark} ${styles.background}` : `${styles.background}`}>
      <img src={isDarkMode ? sunIcon : moonIcon} onClick={toggleTheme} className={styles.mode} />
        <div className={styles.logo_container}>
          <div className={styles.title}>
            <span>CHECKPASS</span>
          </div>
          <div className={styles.text}>
            <span>우리들의 편리한 출결을 위한 서비스 CHEKCPASS</span>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
