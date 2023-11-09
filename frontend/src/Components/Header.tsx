import styles from '../Styles/Component/_header.module.scss';
import axios from 'axios';
import { useTheme } from '../Contexts/DarkModeContext';
import { useState, useEffect } from 'react';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [userNumber, setUserNumber] = useState('');

  useEffect(() => {
    axios
      .get('/api/main')
      .then((res) => {
        setUserNumber(res.data.USER_NUMBER);
      })
      .catch((e) => console.log(e));
  }, []);
  return (
    <div>
      <header className={isDarkMode ? `${styles.header} ${styles.dark}` : `${styles.header}`}>
        <nav className={styles.wrap_header}>
          <a href={`/main/${userNumber}`}>
            <h2>CHECKPASS</h2>
          </a>
          <div className={styles.area_util}>
            <button onClick={toggleTheme} className={styles.click_darkmode}></button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
