import styles from "../../Styles/Component/_loginForm.module.scss";

const LoginForm = () => {
  return (
    <div>
      <div className={styles.login_form}>
        <form>
          <input placeholder="이메일 또는 전화번호"></input>
          <input type="password" placeholder="비밀번호"></input>
        </form>
        <button className={styles.login_button}>로그인</button>
          <a className={styles.new_account} href={"/"}>
        <div className={styles.a_text}>
            새 계정 만들기
          </a>
          <a href={"/"}>비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
