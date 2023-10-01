import axios from "axios";
import { useState } from "react";
import { departmentData } from "../../Constants/department";
import styles from "../../Styles/Component/_form.module.scss";
import { RegexEmail, RegexPassword, RegexName, RegexUserNumber } from "../../Logic/Regex/regex";

interface userData {
  USER_EMAIL: string;
  USER_PASSWORD: string;
  CONFIRM_PASSWORD: string;
  USER_NAME: string;
  USER_TYPE: string;
  USER_NUMBER: string;
  USER_COLLEGE: string;
  USER_DEPARTMENT: string;
}

const SignUpForm = () => {
  const [selectedCollege, setSelectedCollege] = useState<string>("단과대학");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [departmentList, setDepartmentList] = useState<string[]>([]);

  const [isAgreed, setIsAgreed] = useState(false);
  const [userData, setUserData] = useState<userData>({
    USER_EMAIL: "",
    USER_PASSWORD: "",
    CONFIRM_PASSWORD: "",
    USER_NAME: "",
    USER_TYPE: "구분",
    USER_NUMBER: "",
    USER_COLLEGE: "",
    USER_DEPARTMENT: "",
  });

  const changeCollege = (e: any) => {
    const college = e.target.value;
    setSelectedCollege(college);

    if (college !== "단과대학") {
      setDepartmentList(departmentData[college] || []);
    } else {
      setDepartmentList([]);
    }
    setSelectedDepartment("");

    setUserData((prevData) => ({
      ...prevData,
      USER_COLLEGE: college,
    }));
  };

  const changeDepartment = (e: any) => {
    const department = e.target.value;
    setSelectedDepartment(department);

    setUserData((prevData) => ({
      ...prevData,
      USER_DEPARTMENT: department,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(e.target.checked);
  };

  const isValidEmail = (USER_EMAIL: string) => {
    return RegexEmail.test(USER_EMAIL);
  };

  const isValidPassword = (USER_PASSWORD: string) => {
    return RegexPassword.test(USER_PASSWORD);
  };

  const isValidName = (USER_NAME: string) => {
    return RegexName.test(USER_NAME);
  };

  const isValidStudentId = (USER_NUMBER: string) => {
    return RegexUserNumber.test(USER_NUMBER);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !isValidEmail(userData.USER_EMAIL) ||
      !isValidPassword(userData.USER_PASSWORD) ||
      userData.USER_PASSWORD !== userData.CONFIRM_PASSWORD ||
      !isValidName(userData.USER_NAME) ||
      userData.USER_TYPE === "구분" ||
      !isValidStudentId(userData.USER_NUMBER) ||
      !isAgreed
    ) {
      console.error("입력한 정보를 다시 확인해 주세요!");
      return;
    }

    try {
      await axios.post("/api/signUp", userData);
      setUserData({
        USER_EMAIL: "",
        USER_PASSWORD: "",
        CONFIRM_PASSWORD: "",
        USER_NAME: "",
        USER_TYPE: "구분",
        USER_NUMBER: "",
        USER_COLLEGE: "",
        USER_DEPARTMENT: "",
      });
    } catch (e) {
      console.error("가입 오류!", e);
    }
  };

  return (
    <div>
      <div className={styles.form_container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.form_section}>
            <div className={`${styles.form_item} ${styles.email}`}>
              <input type="email" name="USER_EMAIL" placeholder="이메일" onChange={handleInputChange}></input>
            </div>
            <div className={`${styles.form_item} ${styles.password}`}>
              <input type="password" name="USER_PASSWORD" placeholder="비밀번호" onChange={handleInputChange}></input>
            </div>
            <div className={`${styles.form_item} ${styles.password}`}>
              <input
                type="password"
                name="CONFIRM_PASSWORD"
                placeholder="비밀번호 확인"
                onChange={handleInputChange}
              ></input>
            </div>
            <div className={`${styles.form_item} ${styles.name}`}>
              <input type="name" name="USER_NAME" placeholder="이름" onChange={handleInputChange}></input>
            </div>
            <div className={`${styles.form_item} ${styles.user}`}>
              <select name="USER_TYPE" value={userData.USER_TYPE} onChange={handleInputChange}>
                <option>구분</option>
                <option>학생</option>
                <option>교수</option>
                <option>교직원</option>
              </select>
            </div>
            <div className={`${styles.form_item} ${styles.id}`}>
              <input type="text" name="USER_NUMBER" placeholder="학번/교번" onChange={handleInputChange}></input>
            </div>
            <div className={`${styles.form_item} ${styles.colleage}`}>
              <select name="college" value={selectedCollege} onChange={changeCollege}>
                {Object.keys(departmentData).map((college, index) => (
                  <option key={index} value={college}>
                    {college}
                  </option>
                ))}
              </select>
              <select name="department" value={selectedDepartment} onChange={changeDepartment}>
                <option value="">학과</option>
                {departmentList.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            <div className={`${styles.form_item} ${styles.agree}`}>
              <input type="checkbox" className={styles.blind} onChange={handleAgreementChange}></input>
              <span className={styles.agree_text}>개인정보 수집 및 이용에 모두 동의합니다.</span>
            </div>
          </div>
          <div className={styles.button_container}>
            <button className={styles.button} type="submit">
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
