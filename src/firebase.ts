import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCow5KMq_50g1lPYsN3vEYP8RMLS9EAtS0",
  authDomain: "shanmuga-diabetic-clinic.firebaseapp.com",
  projectId: "shanmuga-diabetic-clinic",
  storageBucket: "shanmuga-diabetic-clinic.firebasestorage.app",
  messagingSenderId: "1047720373318",
  appId: "1:1047720373318:web:5478329f4b3685f7b1ae47",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence);