import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDD4Al_9qWP5GOfLVVu-cAjLYuGHTKnBKw",
  authDomain: "stock-v-b71e6.firebaseapp.com",
  projectId: "stock-v-b71e6",
  storageBucket: "stock-v-b71e6.firebasestorage.app",
  messagingSenderId: "265628979981",
  appId: "1:265628979981:web:02204b1f14d6a87f345644"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)