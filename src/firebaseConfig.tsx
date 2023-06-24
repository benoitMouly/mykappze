import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDIOJzdyCTv51JQCP_E6Lo3tGxR2yXVijM",
    authDomain: "kappze.firebaseapp.com",
    projectId: "kappze",
    storageBucket: "kappze.appspot.com",
    messagingSenderId: "169421691212",
    appId: "1:169421691212:web:c3f8045cf6e7342655d7e9"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
