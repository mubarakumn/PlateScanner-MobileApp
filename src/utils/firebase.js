import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdCo0YdElvcewfXBnkmzGEBWV_DMBOsiU",
  authDomain: "platescanner-c1b66.firebaseapp.com",
  projectId: "platescanner-c1b66",
  storageBucket: "platescanner-c1b66.appspot.com",
  messagingSenderId: "1016461444538",
  appId: "1:1016461444538:web:272e187b4777bec9328983",
  measurementId: "G-ZVESMEJ358"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firebase Storage (optional, if you're using it)
const storage = getStorage(app);

export { auth, storage };
