import styles from "../Styles/Components/_loginForm.module.scss";

const LoginForm = () => {
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
        <div className={styles.login_form}>
          <form>
            <input placeholder="이메일 또는 전화번호"></input>
            <input type="password" placeholder="비밀번호"></input>
          </form>
          <button className={styles.login_button}>로그인</button>
          <tr className={styles.a_text}>
            <a className={styles.new_account} href={"/"}>
              새 계정 만들기
            </a>
            <a href={"/"}>비밀번호 찾기</a>
          </tr>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
