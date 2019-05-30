import firebase from 'firebase/app';
import 'firebase/firestore';
import firebaseConfig from '../../firebase.config';

console.log('Initializing Firebase');

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Offline usage
// firebase.firestore().enablePersistence({ synchronizeTabs: true });

const eventCollection = db.collection('event');

export default {
  db,
  eventCollection,
};
