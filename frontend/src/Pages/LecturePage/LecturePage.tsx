import Header from '../../Components/Header';
import { useTheme } from '../../Contexts/DarkModeContext';
import LectureCard from './LectureCard';
import { lectures } from './Lectures';
import styles from '../../Styles/Pages/LecturePage/_lecturePage.module.scss';

const LecturePage = () => {
  const { isDarkMode } = useTheme();

  const days = ['월', '화', '수', '목', '금', '토'];
  const hours = Array.from({ length: 13 }, (_, index) => `${index + 9}시`);

  return (
    <div className={isDarkMode ? `${styles.dark} ${styles.container}` : `${styles.container}`}>
      <Header />
      <div className={styles.main_content}>
        <article className={styles.content_article}>
          <div className={styles.left_container}>
            <select className={styles.select_semester}>
              <option>2023학년 2학기</option>
            </select>
            <div className={styles.lecture_container}>
              <span className={styles.lecture_title}>과목명으로 찾기</span>
              <div className={styles.wrap_search}>
                <input className={styles.search_lecture} placeholder="과목명을 입력하세요"></input>
                <button className={styles.search_icon}></button>
              </div>
              <div className={styles.wrap_card}>
                {lectures.map((lectureInfo, index) => (
                  <LectureCard
                    key={index}
                    lecture={lectureInfo.lecture}
                    professor={lectureInfo.professor}
                    time={lectureInfo.time}
                    location={lectureInfo.location}
                    details={lectureInfo.details}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className={styles.schedule_table}>
            <table>
              <thead>
                <tr>
                  <th></th>
                  {days.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour) => (
                  <tr className={styles.hours} key={hour}>
                    <th className={styles.time_cell}>{hour}</th>
                    {days.map((day) => (
                      <td key={day}></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </div>
  );
};

export default LecturePage;
