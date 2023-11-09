import Header from '../Components/Header';
import styles from '../Styles/Pages/MainPage/_mainPage.module.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useTheme } from '../Contexts/DarkModeContext';

const MainPage = () => {
  const { isDarkMode } = useTheme();
  const [userName, setUserName] = useState('');
  const [userNumber, setUserNumber] = useState('');

  useEffect(() => {
    axios
      .get('/api/main')
      .then((res) => {
        setUserName(res.data.USER_NAME);
        setUserNumber(res.data.USER_NUMBER);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <div className={isDarkMode ? `${styles.dark} ${styles.container}` : `${styles.container}`}>
      <Header />
      <div className={styles.main_content}>
        <article className={styles.content_article}>
          <div className={styles.title_main}>
            <image className={styles.background_image}></image>
            <div className={styles.main_title}>
              <span>
                {userName.slice(1)} 님 안녕하세요
                <br />
                어떤 서비스를 도와드릴까요?
              </span>
            </div>
          </div>
          <div className={styles.content_home}>
            <div className={styles.wrap_item}>
              <div className={styles.item_card}>
                <span className={styles.wrap_cont}>
                  <image className={`${styles.card_icon} ${styles.beacon}`}></image>
                  <span className={styles.title_bubble}>메인 서비스</span>
                </span>
                <a className={styles.card_link} href={`/beacon/${userNumber}`}>
                  <strong className={styles.card_title}>비콘으로 출석하기</strong>
                  <span className={styles.card_hashtag}>
                    <span className={styles.card_keyword}>#빠르고 편리한 출결</span>
                    <span className={styles.card_keyword}>#bluetooth</span>
                    <span className={styles.card_keyword}>#beacon</span>
                  </span>
                  <image className={`${styles.card_image} ${styles.beacon_image}`}></image>
                </a>
              </div>
            </div>
            <div className={styles.wrap_item}>
              <div className={styles.inner_item}>
                <div className={styles.card_half}>
                  <div>
                    <span className={styles.half_wrap_cont}>
                      <image className={`${styles.card_icon} ${styles.megaphone}`}></image>
                      <span className={styles.title_bubble}>비콘이 이상하다면?</span>
                    </span>
                    <a className={styles.card_link} href={`/attendance/${userNumber}`}>
                      <strong className={styles.card_title}>전자출결으로 출석하기</strong>
                      <span className={styles.card_hashtag}>
                        <span className={styles.card_keyword}>#랜덤 코드 출석</span>
                        <span className={styles.card_keyword}>#전자 출석</span>
                        <span className={styles.card_keyword}>#전자 출결</span>
                      </span>
                    </a>
                  </div>
                  <image className={`${styles.card_image} ${styles.attendance_image}`}></image>
                </div>
                <div className={styles.card_half}>
                  <div>
                    <span className={styles.half_wrap_cont}>
                      <image className={`${styles.card_icon} ${styles.lecture}`}></image>
                      <span className={styles.title_bubble}>어떤 강의가 있을까</span>
                    </span>
                    <a className={styles.card_link} href={`/lecture/${userNumber}`}>
                      <strong className={styles.card_title}>강의 등록하러 가기</strong>
                      <span className={styles.card_hashtag}>
                        <span className={styles.card_keyword}>#개설 강의 확인</span>
                        <span className={styles.card_keyword}>#내 강의 보기</span>
                        <span className={styles.card_keyword}>#시간표 보기</span>
                      </span>
                    </a>
                  </div>
                  <image className={`${styles.card_image} ${styles.lecture_image}`}></image>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default MainPage;
