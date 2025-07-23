import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBFk-whqFz7vqZrytV6VPyVcC-txLn-ogI",
  authDomain: "flower-shop-e1119.firebaseapp.com",
  projectId: "flower-shop-e1119",
  storageBucket: "flower-shop-e1119.appspot.com",
  messagingSenderId: "539585838728",
  appId: "1:539585838728:web:7ce98498208c3f1ec1693d",
  measurementId: "G-X4VTCS49WF"
};
let app;
let auth;
let db;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

db = getFirestore(app);

export { app, auth, db };