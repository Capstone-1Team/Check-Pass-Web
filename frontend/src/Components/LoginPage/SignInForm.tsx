import { useState } from "react";
import axios from "axios";
import styles from "../../Styles/Component/_form.module.scss";

const LoginForm = ({ onSignUpClick, onFindPwClick }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/signIn", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        window.location.href = response.data.redirectUrl;
      } else {
        console.log(`로그인 실패: ${response.data.message}`);
      }
    } catch (e) {
      console.error(`로그인 오류: ${e}`);
    }
  };

  return (
    <div>
      <div className={styles.form_container}>
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.form_section}>
            <div className={`${styles.form_item} ${styles.email}`}>
              <input
                type="text"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={`${styles.form_item} ${styles.password}`}>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.button_container}>
            <button className={styles.button} type="submit">
              로그인
            </button>
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
            onClick={(e) => {
              e.preventDefault();
              onFindPwClick();
            }}
          >
            비밀번호 찾기
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
