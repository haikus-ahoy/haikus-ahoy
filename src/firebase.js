// firebase.js
import firebase from 'firebase';

// Initialize Firebase
// USE YOUR CONFIG OBJECT
const firebaseConfig = {
    apiKey: "AIzaSyAvk3cfhc42cepbaALaF97WgFMu15OEw4M",
    authDomain: "haikus-ahoy.firebaseapp.com",
    databaseURL: "https://haikus-ahoy.firebaseio.com",
    projectId: "haikus-ahoy",
    storageBucket: "",
    messagingSenderId: "2500614879",
    appId: "1:2500614879:web:35cb40133a263cf7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// this exports the CONFIGURED version of firebase
export default firebase;