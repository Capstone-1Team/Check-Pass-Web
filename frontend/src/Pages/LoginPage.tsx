import styles from "../Styles/Pages/LoginPage/_loginPage.module.scss";
import SignInForm from "../Components/LoginPage/SignInForm";
import SignUpForm from "../Components/LoginPage/SignUpForm";
import FindPwForm from "../Components/LoginPage/FindPwForm";
import CheckForm from "../Components/LoginPage/CheckForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formToShow, setFormToShow] = useState<string>("signIn");

  const showSignUp = () => {
    setFormToShow("signUp");
    navigate("/login/signUp");
  };

  const showFindPw = () => {
    setFormToShow("findPw");
    navigate("/login/findPw");
  };

  const showCheck = () => {
    setFormToShow("check");
    navigate("/login/check");
  };

  const showSignIn = () => {
    setFormToShow("signIn");
    navigate("/login/signIn");
  };

  return (
    <div className={styles.background}>
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
