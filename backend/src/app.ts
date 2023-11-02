import express, { NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as admin from 'firebase-admin';
import { getAuth, signOut, signInWithEmailAndPassword, UserCredential, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'; // Firebase JavaScript SDK의 메서드들을 불러옵니다.
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const serviceAccount = require('../firebase/serviceAccountKey.json');
const app = express();
const PORT = process.env.PORT;

// Firebase Authentication 초기화
app.use(bodyParser.json());
app.use(cors());

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId:process.env.FIREBASE_APP_ID,
  measurementId:process.env.FIREBASE_MEASUREMENT_ID
};

const router = express.Router();
const firebaseApp = firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const auth = getAuth();
const db = admin.firestore();
let userUid="";
app.use(express.urlencoded({ extended: true }))
/* POST code 추가 */
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
    return res.status(200).json({ message: "로그인에 성공했습니다.", redirectUrl: "http://localhost:3000/main" });
    } catch (error) {
      // 사용자 인증에 실패한 경우 오류 처리
      console.error('로그인 오류_이메일 혹은 비밀번호가 틀립니다.');
      return res.status(401).json({ message:"로그인 실패: 이메일 또는 비밀번호가 올바르지 않습니다.", redirectUrl: "http://localhost:3000"});
    }
  });
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