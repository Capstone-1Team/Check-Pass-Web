import Header from "../Components/Header";
import styles from "../Styles/Pages/AttendancePage/_attendancePage.module.scss";
import { useTheme } from "../Contexts/DarkModeContext";

const BeaconPage = () => {
  const { isDarkMode } = useTheme();

  const students = Array.from({ length: 8 }, (_, row) => (
    <div key={row}>
      {Array.from({ length: 5 }, (_, idx) => (
        <div className={styles.attend_item} key={idx}></div>
      ))}
    </div>
  ));

  return (
    <div className={isDarkMode ? `${styles.dark} ${styles.container}` : `${styles.container}`}>
      <Header />
      <div className={styles.content_container}>
        <div className={styles.left_container}>
          <div className={styles.lecture_container}>
            <select className={styles.select_lecture}>
              <option>캡스톤디자인 I</option>
              <option>컴퓨터 네트워크</option>
              <option>데이터베이스 시스템</option>
              <option>웹 프레임워크</option>
              <option>모바일 프로그래밍</option>
              <option>기계학습</option>
              <option>인공지능</option>
            </select>
            <select className={styles.select_class}>
              <option>1분반</option>
              <option>2분반</option>
            </select>
          </div>
          <div className={styles.attend_container}>{students}</div>
        </div>
        <div className={styles.right_container}>
          <div className={styles.total_student}>정원: 40명</div>
          <div className={styles.current_student}>출석 인원: 0명</div>
        </div>
      </div>
    </div>
  );
};

export default BeaconPage;
