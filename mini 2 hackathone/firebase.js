
// Importing required Firebase modules
import { 
    initializeApp 
  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  
  import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut,          
    onAuthStateChanged,
    signInWithEmailAndPassword,
    sendEmailVerification
  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
  
  import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    Timestamp, 
    query, 
    orderBy, 
    limit, 
    doc, 
    deleteDoc
  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
  
  import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject 
  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
  
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAVRcj7jWfXPdmeqzQc0ODjnUVuxPzaYO8",
    authDomain: "class-check-edfdb.firebaseapp.com",
    projectId: "class-check-edfdb",
    storageBucket: "class-check-edfdb.appspot.com",
    messagingSenderId: "857089767693",
    appId: "1:857089767693:web:5b11b60382faa4899e1844",
    measurementId: "G-34YDTHNCKC"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);  // Initialize Firebase Storage
  
  // Google Auth Provider
  const googleProvider = new GoogleAuthProvider();
  
  // Exporting Firebase services for use in other parts of the app
  export {
    app,
    auth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    GoogleAuthProvider,
    signInWithPopup,
    db,
    collection, 
    addDoc,
    getDocs,
    Timestamp,
    query,
    orderBy,
    limit,
    doc,
    deleteDoc,
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
  };
  
