// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCF5YRke_9RzuQOONX1vFB05xH8PngENqc",
  authDomain: "svelte-forever.firebaseapp.com",
  databaseURL: "https://svelte-forever-default-rtdb.firebaseio.com",
  projectId: "svelte-forever",
  storageBucket: "svelte-forever.appspot.com",
  messagingSenderId: "226934196830",
  appId: "1:226934196830:web:b6b49ea005be128a26c2cf",
  measurementId: "G-Y492VJ0ZMC"
}; 

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export { db };
