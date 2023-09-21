import styles from "../Styles/Pages/LoginPage/_loginPage.module.scss";
import SignInForm from "../Components/LoginPage/SignInForm";
import SignUpForm from "../Components/LoginPage/SignUpForm";
import FindPwForm from "../Components/LoginPage/FindPwForm";
import CheckForm from "../Components/LoginPage/CheckForm";
import sunIcon from "../Assets/Image/sun.png";
import moonIcon from "../Assets/Image/moon.png";
import { useState } from "react";
import { useTheme } from "../Contexts/DarkModeContext";

const LoginPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [formToShow, setFormToShow] = useState<string>("signIn");

  const showSignUp = () => {
    setFormToShow("signUp");
  };

  const showFindPw = () => {
    setFormToShow("findPw");
  };

  const showCheck = () => {
    setFormToShow("check");
  };

  const showSignIn = () => {
    setFormToShow("signIn");
  };

  return (
    <div className={isDarkMode ? `${styles.dark} ${styles.background}` : `${styles.background}`}>
      <img src={isDarkMode ? sunIcon : moonIcon} onClick={toggleTheme} className={styles.mode} />
      <div
        className={
          formToShow === "signUp"
            ? `${styles.container} ${styles.signUp}`
            : formToShow === "findPw"
            ? `${styles.container} ${styles.findPw}`
            : formToShow === "check"
            ? `${styles.container} ${styles.check}`
            : `${styles.container}`
        }
      >
        <div className={styles.logo_container}>
          <div className={styles.title}>
            <span>CHECKPASS</span>
          </div>
          <div className={styles.text}>
            <span>우리들의 편리한 출결을 위한 서비스</span>
          </div>
        </div>
        {formToShow === "signIn" ? (
          <SignInForm onSignUpClick={showSignUp} onFindPwClick={showFindPw} />
        ) : formToShow === "findPw" ? (
          <FindPwForm onCancelClick={showSignIn} onCheckClick={showCheck} />
        ) : formToShow === "check" ? (
          <CheckForm />
        ) : (
          <SignUpForm />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
