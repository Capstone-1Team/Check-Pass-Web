import { useState } from "react";
import { departmentData } from "../../Constants/department";
import styles from "../../Styles/Component/_form.module.scss";

const SignUpForm = () => {
  const [selectedCollege, setSelectedCollege] = useState<string>("단과대학");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [departmentList, setDepartmentList] = useState<string[]>([]);

  const changeCollege = (e: any) => {
    const college = e.target.value;
    setSelectedCollege(college);

    if (college !== "단과대학") {
      setDepartmentList(departmentData[college] || []);
    } else {
      setDepartmentList([]);
    }

    setSelectedDepartment("");
  };

  const changeDepartment = (e: any) => {
    setSelectedDepartment(e.target.value);
  };

  return (
    <div>
      <div className={styles.form_container}>
        <form className={styles.form}>
          <div className={styles.form_section}>
            <div className={`${styles.form_item} ${styles.email}`}>
              <input type="email" placeholder="이메일"></input>
            </div>
            <div className={`${styles.form_item} ${styles.password}`}>
              <input type="password" placeholder="비밀번호"></input>
            </div>
            <div className={`${styles.form_item} ${styles.password}`}>
              <input type="password" placeholder="비밀번호 확인"></input>
            </div>
            <div className={`${styles.form_item} ${styles.phone}`}>
              <input type="tel" placeholder="전화번호"></input>
            </div>
            <div className={`${styles.form_item} ${styles.user}`}>
              <select name="user">
                <option>구분</option>
                <option>학생</option>
                <option>교수</option>
                <option>교직원</option>
              </select>
            </div>
            <div className={`${styles.form_item} ${styles.id}`}>
              <input type="text" placeholder="학번/교번"></input>
            </div>
            <div className={`${styles.form_item} ${styles.colleage}`}>
              <select name="college" value={selectedCollege} onChange={changeCollege}>
                {Object.keys(departmentData).map((college, index) => (
                  <option key={index} value={college}>
                    {college}
                  </option>
                ))}
              </select>
              <select name="department_details" value={selectedDepartment} onChange={changeDepartment}>
                <option value="">학과</option>
                {departmentList.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            <div className={`${styles.form_item} ${styles.agree}`}>
              <input type="checkbox" className={styles.blind}></input>
              <span className={styles.agree_text}>개인정보 수집 및 이용에 모두 동의합니다.</span>
            </div>
          </div>
          <div className={styles.button_container}>
            <button className={styles.button}>회원가입</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
