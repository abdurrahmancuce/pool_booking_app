import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, orderBy, limit, query } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

const signIn = async (email, password) => {
    let userCredential
    try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Başarılı giriş işlemi, yönlendirme veya diğer işlemler burada yapılabilir
        console.log('Giriş başarılı');
    } catch (error) {
        console.error('Giriş hatası:', error);
        throw(mapAuthCodeToMessage(error.code))
    }
    return userCredential

}

const mapAuthCodeToMessage = (authCode) => {
    switch (authCode) {
      case "auth/user-not-found":
        return "Kullanıcı Bulunamadı";
      default:
        return "Email veya Şifre Hatalı";
    }
  }

const addPoolBookList = async (data) => {
    try {
        await addDoc(collection(db, 'poolBookList'), data);
    } catch (error) {
        console.error('An error occured:', error);
    }
};

const getLastPoolBookList = async () => {
    try {
        const querySnapshot = await getDocs(query(collection(db, 'poolBookList'), orderBy('createdAt', 'desc'), limit(1)));
        const lastDocumentSnapshot = querySnapshot.docs[0];
        const lastDocumentData = lastDocumentSnapshot?.data();
        return lastDocumentData
    } catch (error) {
        console.error('An error occured:', error);
        return [];
    }
};


export { app, analytics, db, signIn, addPoolBookList, getLastPoolBookList };