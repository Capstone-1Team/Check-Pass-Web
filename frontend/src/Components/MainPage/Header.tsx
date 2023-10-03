import styles from "../../Styles/Component/_header.module.scss";
import { useTheme } from "../../Contexts/DarkModeContext";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <div>
      <header className={isDarkMode ? `${styles.header} ${styles.dark}` : `${styles.header}`}>
        <nav className={styles.wrap_header}>
          <h2>CHECKPASS</h2>
          <div className={styles.area_util}>
            <button onClick={toggleTheme} className={styles.click_darkmode}></button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
