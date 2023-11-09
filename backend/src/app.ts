import express, { NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import * as firebase from 'firebase/app';
import "firebase/database";
import 'firebase/firestore';
import { getDatabase, ref, child, push, update, get,  onValue, set } from "firebase/database";
import 'firebase/auth';
import * as admin from 'firebase-admin';
import { getAuth, signOut, signInWithEmailAndPassword, UserCredential, createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth'; // Firebase JavaScript SDK의 메서드들을 불러옵니다.
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT; // Port번호 정의 
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const router = express.Router();

//데이터베이스 변수, 초기화 코드입니다. 
const serviceAccount = require('../firebase/serviceAccountKey.json');
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId:process.env.FIREBASE_APP_ID,
  measurementId:process.env.FIREBASE_MEASUREMENT_ID,
  databaseURL:process.env.FIREBASE_URL
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
const database = getDatabase(); 
const dbRef = ref(database);
const auth = getAuth();
const db = admin.firestore();
// 서버에서 임시로 사용자 Uid를 저장해주는 변수입니다.
let userUid=""; 

// 회원가입 로직 _ POST
app.post('/api/signUp', async (req: Request, res: Response, next) => {
  const USER_NAME = req.body.USER_NAME;
  const USER_TYPE = req.body.USER_TYPE;
  const USER_COLLEGE = req.body.USER_COLLEGE;
  const USER_NUMBER = req.body.USER_NUMBER;
  const USER_DEPARTMENT = req.body.USER_DEPARTMENT;
  const USER_EMAIL = req.body.USER_EMAIL;
  const USER_PASSWORD = req.body.USER_PASSWORD;
  console.log(USER_COLLEGE, USER_DEPARTMENT, USER_NAME, USER_TYPE, USER_NUMBER, USER_EMAIL, USER_PASSWORD);
  if (USER_NAME != "" && USER_TYPE != "" && USER_DEPARTMENT != "" && USER_COLLEGE != "" && USER_NUMBER != "") {
    try {
      const auth = getAuth(); // Firebase Authentication 객체를 가져옵니다.
      const userCredential = await createUserWithEmailAndPassword(auth, USER_EMAIL, USER_PASSWORD);
      const user = userCredential.user;
      await sendEmailVerification(user);
      // Firestore에 사용자 정보 추가
      const userUid = user.uid;

      const docRef = await db.collection('USERS').doc(userUid).set({
        DEPARTMENT: [USER_COLLEGE, USER_DEPARTMENT],
        LECTURES: [],
        PROFILE_IMGAGE: 'https://firebasestorage.googleapis.com/v0/b/check-pass.appspot.com/o/profile_test.png?alt=media&token=45997ffe-c022-4c2a-bf82-282b1cc2bb7f',
        USER_NAME: USER_NAME,
        USER_NUMBER: USER_NUMBER,
        USER_TYPE: USER_TYPE
      });
      console.log("Document written with ID: ", userUid);
      return res.status(201).json({message: "성공적으로 회원가입이 완료되었습니다.",redirectUrl: "http://localhost:3000"}); // 사용자 등록이 성공한 경우 응답을 보냅니다.
      
    } catch (error) {
      console.error("Error adding document: ", error);
      return res.status(500).json({message: "회원가입 도중에 문제가 생겼습니다."});
    }
  } else {
    return res.status(401).json({message: "회원가입 실패"});
  };

});

//로그인 로직 
app.post('/api/signIn', async (req: Request, res: Response, next: NextFunction) => {
  const email= req.body.email;
  const password = req.body.password;
  console.log(email, password);
  try {
    // Firebase 인증을 사용하여 이메일 및 비밀번호로 사용자 인증 시도
    const auth = getAuth();
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userdata: any[]=[];
    userdata.push(user.email);userdata.push(user.uid);
    const userDocRef = db.collection('USERS').doc(user.uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      return 
    } else {
      const Data: any = userDoc.data();
      userdata.push(Data.USER_NAME);
      userdata.push(Data.USER_NUMBER);
    }
    console.log(userdata);
    userUid = user.uid;
    } catch (error) {
      // 사용자 인증에 실패한 경우 오류 처리
      console.error('로그인 오류_이메일 혹은 비밀번호가 틀립니다.');
      return res.status(401).json({ message:"로그인 실패: 이메일 또는 비밀번호가 올바르지 않습니다.", redirectUrl: "http://localhost:3000"});
    }
  });
    return res
      .status(200)
      .json({ message: '로그인에 성공했습니다.', redirectUrl: `http://localhost:3000/main/${userdata[3]}` });

  async function getLectureUid(lectureName:any){
    const UserInputlecture = lectureName // 사용자에게 입력받은 강의 이름 
    console.log(UserInputlecture);
    var lectureUid = "";
    try{
      const lectureDocRef = db.collection('LECTURES'); // 사용자가 출석체크하고자 하는 강의의 UID를 찾습니다.
      const getlectureUid = await lectureDocRef.where('LECTURE_NAME','==',lectureName).get();
      getlectureUid.forEach((doc) => {
        lectureUid = doc.id;
      });
    }catch(error){
        console.log("찾지 못함");
      }
    console.log(lectureUid);
    return lectureUid;
  }

  //사용자가 새로운 강의를 추가하였을때 실시간데이터베이스에 추가하는 함수
  async function newLecturesAttendance(lectureUID:any){
    const weekArray: boolean[] = new Array(15).fill(false);
    try {
      await set(child(dbRef, `Attendance/${lectureUID}/${userUid}`), weekArray);
      return true;
    } catch (error) {
      console.error('데이터를 쓰는 중 오류가 발생했습니다:', error);
      return false;
    }
  }
 

  // 새로운 강의 데이터 추가 (임시)_ POST로 변경필요
  app.get('/api/newUserLectureInsert', async (req: Request, res: Response, next) => {
    const Uid = userUid;
    if (Uid==""){
      console.log("USER_UID 비어있음");
      return null;
    }
    const New_LectruesUID = await getLectureUid('캡스톤 디자인');
    console.log("NewLecturesUID = ",New_LectruesUID);
    console.log("USER_UID = ", Uid);
    try{
      const userdocRef = await db.collection('USERS').doc(Uid);
      const userDoc = await userdocRef.get();
      if (!userDoc.exists) {
        return res.status(401).json({ message: '유저를 찾을 수 없습니다.' });
      } else {
        const Data: any = userDoc.data();
        let userLectures = Data.LECTURES || []; // 기존 강의 데이터가 없을 수 있으므로 기본값은 빈 배열로 설정합니다.
        if (userLectures.length === 0){
          await userdocRef.update({
            LECTURES: [New_LectruesUID]
          });
          console.log("정상적으로 데이터 추가가 완료되었습니다.");
          // const New_LectruesString: string = New_LectruesUID;
          // const AttendancedocRef = await db.collection('ATTENDANCE').doc(New_LectruesString);
          // const AttendanceDoc = await AttendancedocRef.get();
          // const userdata: any[] = [];
          // if (!AttendanceDoc.exists) {
          //   return res.status(401).json({ message: '강의에 대한 유저를 찾을 수 없습니다' });
          // } else {
          //   const LectureData: any = AttendanceDoc.data();
          //   userdata.push(LectureData.userUid);
          //   console.log(userdata);
          //   if (userdata.length === 0) {
          //     return res.status(204).json({ message: '사용자의 강의 데이터가 비어있습니다.', redirectUrl: "http://localhost:3000/main" });
          //   }
          //   console.log("강의에 대한 출석체크 리스트 :", userdata);
          // }
          return res.status(201).json({ message: "강의 데이터 추가가 완료되었습니다." });
        } else if (!userLectures.includes(New_LectruesUID)) {
          userLectures.push(New_LectruesUID);
          await userdocRef.update({
            LECTURES: userLectures
          });
          console.log("정상적으로 데이터 추가가 완료되었습니다.");
          return res.status(201).json({ message: "강의 데이터 추가가 완료되었습니다." });
        }else{
          console.log("이미 추가된 강의입니다.");
          return res.status(200).json({ message: "이미 추가된 강의입니다." });
        }
      }
    } catch(error){
      console.error("강의 데이터 추가 중 오류발생", error);
      return res.status(500).json({ message: "강의 데이터 추가 중 오류가 발생했습니다." });
    }
  });

// Get 코드 
// 메인 페이지에서 유저의 데이터 호출  
app.get('/api/main',async (req: Request, res: Response, next: NextFunction) => {
  const Uid = userUid;
  console.log(Uid);
  try {
    const userDocRef = db.collection('USERS').doc(Uid); // 해당 uid에 대한 사용자 정보를 가져옵니다.
    const userDoc = await userDocRef.get();
    const userdata: any[]=[];
    if (!userDoc.exists) {
      return res.status(401).json({ message: '유저를 찾을 수 없습니다.' });
    } else {
      const Data: any = userDoc.data();
      userdata.push(Data.USER_NAME);
      userdata.push(Data.USER_NUMBER);
    }
    console.log(userdata);
    return res.status(200).json({
        USER_NAME:userdata[0],
        USER_NUMBER:userdata[1]})
  } catch (error) {
    console.error('Error User Uid error:', error);
    return res.status(403).json({ message: '로그인 정보를 찾을 수 없습니다',redirectUrl: "http://localhost:3000" });
  }
});

// 유저의 강의 데이터 호출 
app.get('/api/lecture',async (req: Request, res: Response, next: NextFunction) => {
  const Uid = userUid;
  console.log(userUid);
  try {
    const userDocRef = db.collection('USERS').doc(Uid); // 해당 uid에 대한 사용자 정보를 가져옵니다.
    const userDoc = await userDocRef.get();
    const userdata: any[]=[];
    if (!userDoc.exists) {
      return res.status(401).json({ message: '유저를 찾을 수 없습니다.' });
    } else {
      const Data: any = userDoc.data();
      userdata.push(Data.USER_NAME);
      userdata.push(Data.USER_NUMBER);
      userdata.push(Data.LECTURES);
      if (userdata[2] === null){
        console.log(userdata);
        return res.status(204).json({ message: '사용자의 강의 데이터가 비어있습니다.',redirectUrl: "http://localhost:3000/main" });
      }
    }
    console.log(userdata);
    return res.status(200).json({
        USER_NAME:userdata[0],
        USER_NUMBER:userdata[1],
        USER_LECTURES:userdata[2]})
  } catch (error) {
    console.error('유저 UID 에러 :', error);
    return res.status(403).json({ message: '로그인 정보를 찾을 수 없습니다',redirectUrl: "http://localhost:3000"});
  }
});

//logout Logic 
app.get('/signOut', async (req: Request, res: Response, next: NextFunction)=> {
  try {
    const auth = getAuth();
    await signOut(auth);
    userUid = ""; // 현재 사용자 UID를 비웁니다.
    return res.redirect("http://localhost:3000");
  } catch (error) {
    console.error('로그아웃 중에 오류가 발생했습니다:', error);
    // 오류에 대한 적절한 응답을 처리합니다.
    return res.status(500).send('서버 내부 오류');
  }
});

// 임시( 모든 사용자 데이터 불러오기 )
app.get('/api/getAllUsers', async (req: Request, res: Response) => {
  try {
    const usersCollection = db.collection('USERS');
    const querySnapshot = await usersCollection.get();

    if (querySnapshot.empty) {
     return res.send('No users found.');
    } else {
      const users: any[] = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });

      return res.json(users);
    }
  } catch (error) {
    console.error("Error retrieving users: ", error);
    return res.status(500).send(`Error: ${error}`);
  }
});

//문자열 랜덤 생성 함수
function generateRandomString() {
  let characters = '0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
// 임시 저장 전역변수 
let LectureUid = ""; // 임시로 생성한 변수로, 강의 Uid를 담아줍니다 (추후 삭제예정)
let RandomString=""; // 임시로 생성한 변수로, 랜덤으로 생성된 문자열을 임시 저장합니다(추후 삭제예정)

// 전자출결 랜덤 문자열 생성해주기 _ Post로 수정필요
app.get('/api/getRandom', async (req: Request, res: Response) => {
  const randomString = generateRandomString(); //랜덤 문자열 생성 
  console.log(randomString);
  let lectureName = '캡스톤디자인Ⅰ'; // 사용자에게 과목 선택으로 입력 받아와야 함 
  const timeStamp = admin.firestore.Timestamp.fromDate(new Date(Date.now()));
  const fiveMinutesLater = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 5 * 60000 )); // 5분은 60000밀리초로 곱해줍니다.
  console.log(timeStamp, fiveMinutesLater);
  let lectureUid = "";
  try{
    const lectureDocRef = db.collection('LECTURES'); // 사용자가 출석체크하고자 하는 강의의 UID를 찾습니다.
    const getlectureUid = await lectureDocRef.where('LECTURE_NAME','==',lectureName).get();
    getlectureUid.forEach((doc) => {
      lectureUid = doc.id;
    });
    LectureUid= lectureUid; // (임시) 전역변수에 데이터 임시 저장_Uid
    RandomString=randomString; //(임시) 전역변수에 데이터 임시저장_RandomString
    console.log(lectureName, LectureUid);
    
    const docRef = await db.collection('E-ATTENDANCE').doc(lectureUid).set({
      RANDOM_CODE:randomString,
      START_STAMP:timeStamp,
      END_STAMP:fiveMinutesLater
    });
    console.log('Random UID :',lectureName,' / RandomString : ', randomString, ' / 시작시간',  timeStamp, ' / 종료시간', fiveMinutesLater);
    return res.status(201).json({message: "성공적으로 랜덤 문자열이 생성되었습니다.", }); // 사용자 등록이 성공한 경우 응답을 보냅니다.
  }catch(error){
    console.log(error);
    return res.status(500).json({message: "랜덤 문자열 생성에 문제가 발생했습니다."});
  }
});


// 전자출결 랜덤 문자열 확인 ( 임시 ) _ Post로 수정필요
app.get('/api/CheckRandom', async (req: Request, res: Response) => {
  const userinsertRandomString = RandomString; // Post로 사용자가 입력한 문자열을 받아와야 합니다.
  const timeStamp = admin.firestore.Timestamp.fromDate(new Date(Date.now()));
  const LectureUid = '442184-1'; // Post로 강의 이름 or Uid를 받아와야 합니다 ( )
  const nowweek = 7; // Post로 입력 받아와야 합니다 ( 출석하고자 하는 주차 )
  const userDoc = await db.collection('E-ATTENDANCE').doc(LectureUid).get();
  let Attendancedata =[];
  if (!userDoc.exists) {
    return res.status(401).json({ message: '전자출결 데이터를 불러올 수 없습니다.' });
  } else {
    const Data: any = userDoc.data();
    Attendancedata.push(Data.RANDOM_CODE);
    Attendancedata.push(Data.START_STAMP);
    Attendancedata.push(Data.END_STAMP);
  }
  console.log(Attendancedata);
  if (Attendancedata[1] < timeStamp && Attendancedata[2] > timeStamp && Attendancedata[0] == userinsertRandomString) {
    try {
        let weekArray: any[] = [];
        let obj: any = {};
        const snapshot = await get(child(dbRef, `Attendance/${LectureUid}/${userUid}`));
        if (snapshot.exists()) {
            weekArray = snapshot.val(); // 데이터를 배열에 저장합니다.
            weekArray[nowweek] = true; // 첫 번째 값을 true로 변경합니다.
            for (let i = 0; i < weekArray.length; i++) {
                obj[`${i}`] = weekArray[i];
            }
            console.log(weekArray);
            await update(child(dbRef, `Attendance/${LectureUid}/${userUid}`), obj);
            console.log("데이터가 성공적으로 업데이트되었습니다.");
            return res.status(201).json({ message: '정상적으로 출석되었습니다.' });
        } else {
            return res.status(404).json({ message: '출석 데이터가 없습니다.' });
        }
    } catch (error) {
        console.error('데이터를 쓰는 중 오류가 발생했습니다:', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  } else {
      return res.status(204).json({ message: '시간초과입니다.' });
  }
});


//사용자의 출석 현황을 파악하기 위한 코드 => post로 수정필요, 강의 데이터(강의명 or Uid)를 불러와야합니다. 
app.get('/api/getUserAttendance', async (req: Request, res: Response) => {
  const LectureName = '캡스톤디자인Ⅰ'// 어떤 강의에 대한 출석 현황인지 데이터를 가져와야합니다 (해당 Post로 입력 받아야 합니다.)
  const LectruesUID = await getLectureUid(LectureName); 
  console.log(userUid, LectruesUID);
  try {
    // 데이터 읽기
    onValue(child(dbRef, `Attendance/${LectruesUID}/${userUid}`), (snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        return res.status(200).json(snapshot.val()); // 데이터를 응답으로 전송
      } else {
        return res.status(404).json({ message: '데이터가 없습니다.' });
      }
    });
  } catch (error) {
    console.error('데이터를 읽는 중 오류가 발생했습니다:', error);
    return res.status(500).json({ message: '서버 내부 오류' });
  }
});

// localhost이동 
app.get('/',(req:Request, res:Response, next)=>{
  console.log(userUid);
  if (userUid!=""){
    return res.redirect('http://localhost:3000/main');  
  }
  return res.redirect('http://localhost:3000');
})


//포트 시작번호
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});