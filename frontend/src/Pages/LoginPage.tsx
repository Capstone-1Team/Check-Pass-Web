import styles from "../Styles/Pages/_loginPage.module.scss";
import variable from "../Styles/_variable.module.scss";
import LoginForm from "../Components/LoginPage/LoginForm";
import sunIcon from "../Assets/Image/sun.png";
import moonIcon from "../Assets/Image/moon.png";
import { useState } from "react";

const LoginPage = () => {
  const [mode, setMode] = useState<boolean>(false);

  const changeMode = () => {
    setMode(!mode);
  };

  return (
    <div className={mode ? `${variable.dark} ${styles.background}` : `${styles.background}`}>
      <img src={mode ? moonIcon : sunIcon} onClick={changeMode} className={styles.mode} />
      <div className={styles.container}>
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
