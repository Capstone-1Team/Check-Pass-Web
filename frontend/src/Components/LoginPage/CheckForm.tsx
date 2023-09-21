import styles from "../../Styles/Component/_form.module.scss";

const CheckForm = () => {
  return (
    <div>
      <div className={styles.form_container}>
        <div className={styles.form_header}>
          <span className={styles.header_text}>비밀번호 재설정</span>
        </div>
        <div className={styles.reset_container}>
          <div className={styles.mail_icon}></div>
          <div className={styles.reset_text}>
            <p>check****@gmail.com 로</p>
            <p>비밀번호 재설정 이메일을 전송하시겠습니까?</p>
          </div>
        </div>
        <form className={styles.form}>
          <div className={styles.button_container}>
            <button className={`${styles.button} ${styles.cancelBtn}`}>취소</button>
            <button className={`${styles.button} ${styles.checkBtn}`}>확인</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckForm;
