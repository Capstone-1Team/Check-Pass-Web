import styles from '../../Styles/Pages/LecturePage/_lecturePage.module.scss';

interface LectureCardProps {
  lecture: string;
  professor: string;
  time: string;
  location: string;
  details: string;
}

const LectureCard: React.FC<LectureCardProps> = ({ lecture, professor, time, location, details }) => {
  return (
    <div className={styles.lecture_card}>
      <span className={styles.lecture}>{lecture}</span>
      <span className={styles.professor}>{professor}</span>
      <span className={styles.lecture_time}>{time}</span>
      <span className={styles.location}>{location}</span>
      <span className={styles.details}>{details}</span>
    </div>
  );
};

export default LectureCard;
