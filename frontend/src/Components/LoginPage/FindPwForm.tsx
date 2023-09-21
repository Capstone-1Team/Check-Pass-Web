import styles from "../../Styles/Component/_form.module.scss";

const FindPwForm = ({ onCancelClick, onCheckClick }: any) => {
  const clickedCancel = () => {
    onCancelClick();
  };

  const clickedCheck = () => {
    onCheckClick();
  };

  return (
    <div>
      <div className={styles.form_container}>
        <div className={styles.form_header}>
          <span className={styles.header_text}>비밀번호 찾기</span>
        </div>
        <form className={styles.form}>
          <div className={styles.form_section}>
            <div className={`${styles.form_item} ${styles.email}`}>
              <input placeholder="이메일을 입력하세요"></input>
            </div>
          </div>
          <div className={styles.button_container}>
            <button className={`${styles.button} ${styles.cancelBtn}`} onClick={clickedCancel}>
              취소
            </button>
            <button className={`${styles.button} ${styles.checkBtn}`} onClick={clickedCheck}>
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FindPwForm;
