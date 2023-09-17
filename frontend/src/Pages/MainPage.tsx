import Header from "../Components/MainPage/Header";
import styles from "../Styles/Pages/MainPage/_mainPage.module.scss";
import { useTheme } from "../Contexts/DarkModeContext";

const MainPage = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={isDarkMode ? `${styles.dark} ${styles.container}` : `${styles.container}`}>
      <Header />
      <div className={styles.main_content}>
        <article className={styles.content_article}>
          <div className={styles.title_main}>
            <div className={styles.background_image}></div>
            <div className={styles.main_title}>
              <span>
                캡스톤 디자인 1팀
                <br />
                CHECKPASS입니다
              </span>
            </div>
          </div>
          <div className={styles.content_home}>
            <div className={styles.wrap_item}>
              <div className={styles.item_card}></div>
            </div>
            <div className={styles.wrap_item}>
              <div className={styles.inner_item}>
                <div className={styles.card_half}></div>
                <div className={styles.card_half}></div>
                <div className={styles.card_half}></div>
                <div className={styles.card_half}></div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default MainPage;
