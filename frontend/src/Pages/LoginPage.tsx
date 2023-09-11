import styles from "../Styles/Pages/_loginPage.module.scss";
import LoginForm from "../Components/LoginPage/LoginForm";

const LoginPage = () => {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.logo_container}>
          <div className={styles.title}>
            <span>CHECKPASS</span>
          </div>
          <div className={styles.text}>
            <span>
              CHECKPASS는 어쩌구저쩌구꿍시꿍시
              <br />
              이러한 플랫폼입니다 어쩌구저쩌구꿍시꿍시
            </span>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
