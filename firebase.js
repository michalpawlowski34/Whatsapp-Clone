import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCzRY6iA5PexEPGyYWBP1tZ3Agxsv1jJn8",
    authDomain: "whatsapp-clone-b3735.firebaseapp.com",
    projectId: "whatsapp-clone-b3735",
    storageBucket: "whatsapp-clone-b3735.appspot.com",
    messagingSenderId: "1096362020936",
    appId: "1:1096362020936:web:228e6775f92bea06a4487d"
  };

  const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) :firebase.app()

  const db = app.firestore();
  const auth = app.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export {db, auth, provider};