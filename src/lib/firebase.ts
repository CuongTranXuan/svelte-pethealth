import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - using the legacy credentials structure
const firebaseConfig = {
  apiKey: 'AIzaSyCRRK3C0fRkCPEdnjlDFRAWg_2ksTL-LmM',
  authDomain: 'pet-health-ba01d.firebaseapp.com',
  databaseURL: 'https://pet-health-ba01d.firebaseio.com',
  projectId: 'pet-health-ba01d',
  storageBucket: 'pet-health-ba01d.appspot.com',
  messagingSenderId: '982821972455',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
