import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFirestore, collection, doc, getDoc, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';


interface User {
    id: string;
    isAdmin: boolean;
    // Inclure ici d'autres propriétés de l'utilisateur si nécessaire
  }
  
  interface Role {
    uid: string;
    isAdmin: boolean;
  }
  
  interface CanalData {
    role: Role[];
  }
  
  export const fetchCanalUsers = createAsyncThunk<
    User[], // Le type de la valeur de retour de la promesse
    string, // Le type du payload
    {} // Le type des informations de rejet si la promesse est rejetée
  >('canals/fetchCanalUsers', async (canalId) => {
    const db = getFirestore();
  
    // Get the canal data
    const canalRef = doc(db, 'canals', canalId);
    const canalSnapshot = await getDoc(canalRef);
    const canalData = canalSnapshot.data() as CanalData;
  
    // Get the users associated with this canal
    const usersQuery = query(collection(db, 'userCanals'), where('canalId', '==', canalId));
    const usersSnapshot = await getDocs(usersQuery);
  
    const usersData: User[] = [];
    for (const userDoc of usersSnapshot.docs) {
      const userCanalData = userDoc.data();
      const userId = userCanalData.userId;
  
      // Get the user's information from its reference
      const userRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userRef);
  
      if (userSnapshot.exists()) {
        const userData: User = { id: userId, ...userSnapshot.data(), isAdmin: false };
  
        // Check if the user is an admin
        if (Array.isArray(canalData.role)) {
          for (let role of canalData.role) {
            if (role.uid === userId && role.isAdmin) {
              userData.isAdmin = true;
              break;
            }
          }
        }
  
        usersData.push(userData);
      }
    }
  
    return usersData;
  });


export const removeUserFromCanal = createAsyncThunk(
    'canals/removeUserFromCanal',
    async ({ userId, canalId }) => {
        const db = getFirestore();

        // Query to get the document ID of the user-canal link
        const userCanalQuery = query(collection(db, 'userCanals'), where('userId', '==', userId), where('canalId', '==', canalId));
        const userCanalSnapshot = await getDocs(userCanalQuery);

        if (!userCanalSnapshot.empty) {
            // Assuming there is only one document that matches the query
            const docId = userCanalSnapshot.docs[0].id;

            // Delete the document
            await deleteDoc(doc(db, 'userCanals', docId));
        } else {
            throw new Error('La liaison entre l\'utilisateur et l\'canal n\'a pas été trouvée');
        }

        // Get the canal document
        const canalRef = doc(db, 'canals', canalId);
        const canalSnap = await getDoc(canalRef);
        
        if (canalSnap.exists) {
            // Filter out the user from the roles array
            const canalData = canalSnap.data();
            const filteredRoles = canalData.role.filter(role => role.uid !== userId);

            // Update the canal document with the filtered roles array
            await updateDoc(canalRef, { role: filteredRoles });
        } else {
            throw new Error('L\'canal n\'a pas été trouvée');
        }
    }
);




const canalUsersSlice = createSlice({
    name: 'canalUsers',
    initialState: {
        status: 'idle',
        data: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCanalUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCanalUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // console.log(state.data)
                state.data = action.payload;
            })
            .addCase(fetchCanalUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default canalUsersSlice.reducer;
