import styles from "../../Styles/Component/_form.module.scss";

const LoginForm = ({ onSignUpClick, onFindPwClick }: any) => {
  return (
    <div>
      <div className={styles.form_container}>
        <form className={styles.form}>
          <div className={styles.form_section}>
            <div className={`${styles.form_item} ${styles.email}`}>
              <input placeholder="이메일을 입력하세요"></input>
            </div>
            <div className={`${styles.form_item} ${styles.password}`}>
              <input type="password" placeholder="비밀번호를 입력하세요"></input>
            </div>
          </div>
          <div className={styles.button_container}>
            <button className={styles.button}>로그인</button>
          </div>
        </form>
        <div className={styles.a_text}>
          <a
            className={styles.new_account}
            href={"/"}
            onClick={(e) => {
              e.preventDefault();
              onSignUpClick();
            }}
          >
            새 계정 만들기
          </a>
          <a
            href={"/"}
          >
            비밀번호 찾기
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
