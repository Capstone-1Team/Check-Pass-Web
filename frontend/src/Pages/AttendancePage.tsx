import Header from "../Components/Header";
import styles from "../Styles/Pages/AttendancePage/_attendancePage.module.scss";
import { useTheme } from "../Contexts/DarkModeContext";
import BeaconPage from "./BeaconPage";

const AttendancePage = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={isDarkMode ? `${styles.dark} ${styles.container}` : `${styles.container}`}>
      <Header />
      <BeaconPage />
      <button className={styles.code_button}>코드 생성기</button>
    </div>
  );
};

export default AttendancePage;
