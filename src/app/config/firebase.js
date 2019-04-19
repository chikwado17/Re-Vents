import firebase from 'firebase';
import 'firebase/firestore';

var config = {
    apiKey: "AIzaSyAecB5MRQbJMe5m5Jzl-38QqrBbkkeQh-4",
    authDomain: "revents-236316.firebaseapp.com",
    databaseURL: "https://revents-236316.firebaseio.com",
    projectId: "revents-236316",
    storageBucket: "",
    messagingSenderId: "886080437357"
  };
  firebase.initializeApp(config);
  const firestore = firebase.firestore();
  const settings = {
    timestampsInSnapshots: true
  }

  firestore.settings(settings);
  var provider = new firebase.auth.FacebookAuthProvider();
  var googleProvider = new firebase.auth.GoogleAuthProvider();


  export { firebase as default, provider, googleProvider};