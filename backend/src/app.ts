import express, { NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as admin from 'firebase-admin';
import { getAuth, signOut, signInWithEmailAndPassword, UserCredential, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'; // Firebase JavaScript SDK의 메서드들을 불러옵니다.
import dotenv from "dotenv";
import cors from "cors";
import { userInfo } from "os";


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
      res.status(200).json({message: "User registration successful.",redirectUrl: "http://localhost:3000"}); // 사용자 등록이 성공한 경우 응답을 보냅니다.
      // res.status(200).send("http://localhost:3000");
      
    } catch (error) {
      
      console.error("Error adding document: ", error);
      next();
      res.status(500).send(`Error: ${error}`);
    }
  } else {
    res.status(200).redirect("/");
  };

});

//로그인 로직 
app.get('/api/signIn', async (req: Request, res: Response, next: NextFunction) => {
  const email= req.body.email;
  // const email= "test123@test.com";
  const password = req.body.password;
  // const password = "test123!!";

  console.log(email, password);

  try {
    // Firebase 인증을 사용하여 이메일 및 비밀번호로 사용자 인증 시도
    const auth = getAuth();
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    // 사용자 인증에 성공한 경우, 사용자 정보와 Firebase Authentication 토큰을 클라이언트에게 반환
    const user = userCredential.user;
    const token = await admin.auth().createCustomToken(user.uid);
    const userdata: any[]=[];
    userdata.push(user.email);userdata.push(user.uid);
    const userDocRef = db.collection('USERS').doc(user.uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      res.send('No documents found.');
    } else {
      const Data: any = userDoc.data();
      userdata.push(Data.USER_NAME);
      userdata.push(Data.USER_NUMBER);
    }
    userdata.push(token);
    console.log(userdata);
    res.status(200).json({Email:userdata[0],
                          UserUID:userdata[1],
                          USER_NAME:userdata[2],
                          USER_NUMBER:userdata[3],
                          USER_TOKEN:userdata[4],
                          redirectUrl: "http://localhost:3000/main"});
    } catch (error) {
      // 사용자 인증에 실패한 경우 오류 처리
      console.error('로그인 오류:', error);
      res.status(401).json({  message:"로그인 실패: 이메일 또는 비밀번호가 올바르지 않습니다.",
                              redirectUrl: "http://localhost:3000/main"});
    }
  });
app.get('/signOut', async (req: Request, res: Response) => {
  
  const auth = getAuth();
  signOut(auth).then(() => {
  }).catch((error) => {
  });
});

// // 토큰에 대한 정보 확인 미들웨어 
// const verifyToken = async (req : Request, res:Response , next: NextFunction) => {
//   // const idToken = req.Token;

//   try {
//     // const decodedToken = await admin.auth().verifyIdToken(idToken);
//     // const uid = decodedToken.uid;
//     // 여기서 uid를 사용하여 특정 사용자를 확인하고 작업을 수행할 수 있습니다.
//     // 예: 데이터베이스에서 사용자 정보를 가져오는 등의 작업
//     // ...

//     // 특정 사용자에 대한 데이터를 가져온 후 다음 미들웨어로 이동
//     // req.uid = uid;
//     next();
//   } catch (error) {
//     // 토큰이 유효하지 않은 경우 에러 처리
//     console.error('Invalid token:', error);
//     res.sendStatus(403);
//   }
// };

app.get('/api/getAllUsers', async (req: Request, res: Response) => {
  try {
    const usersCollection = db.collection('USERS');
    const querySnapshot = await usersCollection.get();

    if (querySnapshot.empty) {
      res.send('No users found.');
    } else {
      const users: any[] = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });

      res.json(users);
    }
  } catch (error) {
    console.error("Error retrieving users: ", error);
    res.status(500).send(`Error: ${error}`);
  }
});
app.get('/api/getUserDataByToken', async (req: Request, res: Response) => {

});

app.get('/',(req:Request, res:Response, next)=>{
  res.redirect('/');
})
app.post('/process', (req: Request, res: Response, next) => {
  // const fieldValue = req.body.fieldValue;
  // const fieldName = req.body.fieldName;

  // console.log(fieldValue, fieldName);

  // if (!fieldName || !fieldValue) {
  //   res.status(400).send('Both fieldName and fieldValue are required.');
  //   return;
  // }

  // db.collection('USERS')
  //   .where()
  //   .get()
  //   .then((querySnapshot) => {
  //     if (querySnapshot.empty) {
  //       res.send('No documents found.');
  //     } else {
  //       const documents: any[] = [];
  //       querySnapshot.forEach((doc) => {
  //         documents.push(doc.data().USER_NUMBER);
  //       });
  //       res.send(`Documents data: ${JSON.stringify(documents)}`);
  //     }
  //   })
  //   .catch((error) => {
  //     res.status(500).send(`Error: ${error}`);
  //   });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});