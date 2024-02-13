

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get,
        push, update, remove, query, orderByChild, equalTo, limitToLast } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyBbHc_59u8ME58slVFExX_CWx2e0xOv6p4",
  authDomain: "aie-doc-doc.firebaseapp.com",
  projectId: "aie-doc-doc",
  storageBucket: "aie-doc-doc.appspot.com",
  messagingSenderId: "245151444648",
  appId: "1:245151444648:web:44f9308b9a72921ce5dc9d",
  databaseURL: 'https://aie-doc-doc-default-rtdb.europe-west1.firebasedatabase.app'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

console.log('app is', app)

const pushToDatabase = async (path, data) => {
    // path is either 'notes' or 'entries'
    console.log('pushToDatabase', path, data)
    try {
        const newEntryRef = push(ref(database, path)); // This generates a unique ID.
        await set(newEntryRef, data);
        return { success: true, id: newEntryRef.key }; // Return the unique ID.
    } catch (error) {
        console.error("Error writing data:", error);
        return { success: false, error };
    }
}

const updateDatabase = async (path, uid, data) => {
    // path is either 'notes' or 'entries'
    try {
        const entryPath = `${path}/${uid}`;
        await update(ref(database, entryPath), data);
        return { success: true };
    } catch (error) {
        console.error("Error updating data:", error);
        return { success: false, error };
    }
}

const write = async (path, data) => {
    // path is either 'notes' or 'entries'
    try {
      await set(ref(database, path), data);
      return { success: true };
    } catch (error) {
      console.error("Error writing data:", error);
      return { success: false, error };
    }
  }
  
  const read = async (path) => {
    // path is either 'notes' or 'entries'
    try {
      const snapshot = await get(ref(database, path));
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error reading data:", error);
      return null;
    }
  }
  
  const deleteFromDatabase = async (path, uid) => {
    // path is either 'notes' or 'entries', uid is the unique id of the note to be deleted
    const entryPath = `${path}/${uid}`;
    try {
        await remove(ref(database, entryPath));
        return { success: true };
    } catch (error) {
        console.error("Error deleting data:", error);
        return { success: false, error };
    }
  }

  const fetchUserNotes = async (_user) => {
    try {
      const notesRef = ref(database, 'notes');
      const notesQuery = query(notesRef, orderByChild('user'), equalTo(_user));
      const snapshot = await get(notesQuery);

        if (snapshot.exists()) {
            // Convert snapshot to array format for easier processing
            return Object.keys(snapshot.val()).map(key => {
                return {
                    id: key,
                    ...snapshot.val()[key]
                };
            });
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching all notes:", error);
        return [];
    }
  }

  // FirebaseHandler.js



  
  export { write, read , 
    pushToDatabase, updateDatabase,
    deleteFromDatabase, fetchUserNotes
    };

  