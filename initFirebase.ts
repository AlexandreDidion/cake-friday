import { FirebaseOptions, getApp, initializeApp } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getAuth, connectAuthEmulator } from "firebase/auth"


const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

function createFirebaseApp(config: FirebaseOptions) {
  try {
    return getApp()
  } catch {
    return initializeApp(config)
  }
}

const firebaseApp = createFirebaseApp(config)
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
connectFirestoreEmulator(db, 'localhost', 8080)
connectAuthEmulator(auth, 'http://localhost:9099')
