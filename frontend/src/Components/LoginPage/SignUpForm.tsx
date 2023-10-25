import axios from "axios";
import { useState } from "react";
import { departmentData } from "../../Constants/department";
import styles from "../../Styles/Component/_form.module.scss";
import { RegexEmail, RegexPassword, RegexUserNumber } from "../../Logic/Regex/regex";

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

  const [emailError, setEmailError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [idError, setIdError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [departmentError, setDepartmentError] = useState(false);
  const [userTypeError, setUserTypeError] = useState(false);

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
    console.log(isAgreed);
  };

  const isValidEmail = (USER_EMAIL: string) => {
    return RegexEmail.test(USER_EMAIL);
  };

  const isValidPassword = (USER_PASSWORD: string) => {
    return RegexPassword.test(USER_PASSWORD);
  };

  const isValidStudentId = (USER_NUMBER: string) => {
    return RegexUserNumber.test(USER_NUMBER);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailValid = isValidEmail(userData.USER_EMAIL);
    const passwordValid = isValidPassword(userData.USER_PASSWORD);
    const confirmPasswordValid = userData.USER_PASSWORD === userData.CONFIRM_PASSWORD;
    const nameValid = !!userData.USER_NAME;
    const userTypeValid = userData.USER_TYPE !== "구분";
    const numberValid = isValidStudentId(userData.USER_NUMBER);
    const departmentValid = userData.USER_DEPARTMENT !== "";

    setEmailError(!emailValid);
    setPwError(!passwordValid);
    setNameError(!nameValid);
    setUserTypeError(!userTypeValid);
    setIdError(!numberValid);
    setDepartmentError(!departmentValid);

    if (
      !emailValid ||
      !passwordValid ||
      !confirmPasswordValid ||
      !nameValid ||
      !departmentValid ||
      !userTypeValid ||
      !numberValid ||
      !isAgreed
    ) {
      console.error("입력한 정보를 다시 확인해 주세요!");
      return;
    } else {
      console.log(userData);
    }

    try {
      const response = await axios.post("/api/signUp", userData);

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

      if (response.status === 201) {
        window.location.href = response.data.redirectUrl;
      } else {
        console.log(`회원 가입 실패: ${response.data.message}`);
      }
    } catch (e) {
      console.error(`회원 가입 오류: ${e}`);
    }
  };

  return (
    <div>
      <div className={styles.form_container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.form_section}>
            <div
              className={`${styles.form_item} ${styles.email} ${
                !isValidEmail(userData.USER_EMAIL) && emailError ? styles.error : ""
              }`}
            >
              <input
                type="email"
                name="USER_EMAIL"
                placeholder="이메일"
                onChange={handleInputChange}
                onFocus={() => setEmailError(true)}
                onBlur={() => isValidEmail(userData.USER_EMAIL)}
              ></input>
            </div>
            <span
              className={`${styles.error_message} ${
                !isValidEmail(userData.USER_EMAIL) && emailError ? styles.error : ""
              }`}
              hidden={isValidEmail(userData.USER_EMAIL) || !emailError}
            >
              올바른 이메일 형식이 아닙니다.
            </span>
            <div
              className={`${styles.form_item} ${styles.password} ${
                !isValidPassword(userData.USER_PASSWORD) && pwError ? styles.error : ""
              }`}
            >
              <input
                type="password"
                name="USER_PASSWORD"
                placeholder="비밀번호"
                onChange={handleInputChange}
                onFocus={() => setPwError(true)}
                onBlur={() => !isValidPassword(userData.USER_PASSWORD)}
              ></input>
            </div>
            <span
              className={`${styles.error_message} ${
                !isValidPassword(userData.USER_PASSWORD) && pwError ? styles.error : ""
              }`}
              hidden={isValidPassword(userData.USER_PASSWORD) || !pwError}
            >
              비밀번호: 6~16자의 영문, 숫자, 특수문자를 사용해 주세요.
            </span>
            <div
              className={`${styles.form_item} ${styles.password} ${
                userData.USER_PASSWORD !== userData.CONFIRM_PASSWORD ? styles.error : ""
              }`}
            >
              <input
                type="password"
                name="CONFIRM_PASSWORD"
                placeholder="비밀번호 확인"
                onChange={handleInputChange}
              ></input>
            </div>
            <span
              className={`${styles.error_message} ${
                userData.USER_PASSWORD !== userData.CONFIRM_PASSWORD ? styles.error : ""
              }`}
              hidden={userData.USER_PASSWORD === userData.CONFIRM_PASSWORD}
            >
              비밀번호를 다시 확인해 주세요.
            </span>
            <div
              className={`${styles.form_item} ${styles.name} ${!userData.USER_NAME && nameError ? styles.error : ""}`}
            >
              <input
                type="name"
                name="USER_NAME"
                placeholder="이름"
                onChange={handleInputChange}
                onFocus={() => setNameError(true)}
                onBlur={() => !!userData.USER_NAME}
              ></input>
            </div>
            <span
              className={`${styles.error_message} ${!userData.USER_NAME && nameError ? styles.error : ""}`}
              hidden={!!userData.USER_NAME || !nameError}
            >
              이름: 필수 정보입니다.
            </span>
            <div
              className={`${styles.form_item} ${styles.user} ${
                userData.USER_TYPE === "구분" && userTypeError ? styles.error : ""
              }`}
            >
              <select
                name="USER_TYPE"
                value={userData.USER_TYPE}
                onChange={handleInputChange}
                onFocus={() => setUserTypeError(true)}
                onBlur={() => userData.USER_TYPE !== "구분"}
              >
                <option>구분</option>
                <option>학생</option>
                <option>교수</option>
                <option>교직원</option>
              </select>
            </div>
            <span
              className={`${styles.error_message} ${
                userData.USER_TYPE === "구분" && userTypeError ? styles.error : ""
              }`}
              hidden={userData.USER_TYPE !== "구분" || !userTypeError}
            >
              구분: 필수 정보입니다.
            </span>
            <div
              className={`${styles.form_item} ${styles.id} ${
                !isValidStudentId(userData.USER_NUMBER) && idError ? styles.error : ""
              }`}
            >
              <input
                type="text"
                name="USER_NUMBER"
                placeholder="학번/교번"
                onChange={handleInputChange}
                onFocus={() => setIdError(true)}
                onBlur={() => !isValidStudentId(userData.USER_NUMBER)}
              ></input>
            </div>
            <span
              className={`${styles.error_message} ${
                !isValidStudentId(userData.USER_NUMBER) && idError ? styles.error : ""
              }`}
              hidden={isValidStudentId(userData.USER_NUMBER) || !idError}
            >
              학번: 7자의 숫자로 입력해 주세요.
            </span>
            <div
              className={`${styles.form_item} ${styles.colleage} ${
                userData.USER_DEPARTMENT === "" && departmentError ? styles.error : ""
              }`}
            >
              <select
                name="college"
                value={selectedCollege}
                onChange={changeCollege}
                onFocus={() => setDepartmentError(true)}
                onBlur={() => userData.USER_DEPARTMENT !== ""}
              >
                {Object.keys(departmentData).map((college, index) => (
                  <option key={index} value={college}>
                    {college}
                  </option>
                ))}
              </select>
              <select
                name="department"
                value={selectedDepartment}
                onChange={changeDepartment}
                onFocus={() => setDepartmentError(true)}
                onBlur={() => userData.USER_DEPARTMENT !== ""}
              >
                <option value="">학과</option>
                {departmentList.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            <span
              className={`${styles.error_message} ${
                userData.USER_DEPARTMENT === "" && departmentError ? styles.error : ""
              }`}
              hidden={userData.USER_DEPARTMENT !== "" || !departmentError}
            >
              학적: 필수 정보입니다.
            </span>
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
