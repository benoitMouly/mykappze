import { createSlice, createAsyncThunk, PayloadAction, Action } from '@reduxjs/toolkit';
import { getFirestore, collection, where, query, getDocs, addDoc, getDoc, doc, updateDoc, deleteDoc} from 'firebase/firestore';

interface Association {
  id: string;
  isAdmin: boolean;
  [key: string]: any;
}

interface AssociationState {
  status: string;
  data: Association[];
  error: string | null;
}

export const fetchAssociations = createAsyncThunk<Association[], string>(
  'associations/fetchAssociations',
  async (userId: string, { rejectWithValue }) => {
    try {
      const db = getFirestore();
      const userAssociationsRef = collection(db, 'userAssociations');
      const userAssociationsQuery = query(userAssociationsRef, where('userId', '==', userId));
      const userAssociationsSnapshot = await getDocs(userAssociationsQuery);
      const associationIds = userAssociationsSnapshot.docs.map((doc) => doc.data().associationId);
      const associationsData: Association[] = [];

      for (const associationId of associationIds) {
        const associationRef = doc(db, 'associations', associationId);
        const associationSnapshot = await getDoc(associationRef);

        if (associationSnapshot.exists()) {
          const associationData = associationSnapshot.data();
          let isAdmin = false;

          if (Array.isArray(associationData.role)) {
            for (let role of associationData.role) {
              if (role.uid === userId && role.isAdmin) {
                isAdmin = true;
                break;
              }
            }
          }

          associationsData.push({ id: associationId, isAdmin, ...associationData });
        }
      }

      return associationsData;
    } catch (err) {
      return rejectWithValue(err.message || 'Unknown error');
    }
  }
);



// export const getAssociation = createAsyncThunk<Association, string>(
//   'associations/getAssociation',
//   async (associationId: string | any , { rejectWithValue }) => {
//     try {
//       const db = getFirestore();
//       const associationRef = doc(db, 'associations', associationId);
//       const associationSnapshot = await getDoc(associationRef);

//       if (!associationSnapshot.exists()) {
//         throw new Error('Association not found');
//       }

//       const associationData = associationSnapshot.data();
//       let isAdmin = false;

//       if (Array.isArray(associationData.role)) {
//         // Use your logic here to determine if a user is an admin
//         // For example:
//         // const { uid } = firebase.auth().currentUser;
//         // isAdmin = associationData.role.some(role => role.uid === uid && role.isAdmin);
//       }

//       return { id: associationId, isAdmin, ...associationData };
//     } catch (err) {
//       return rejectWithValue(err.message || 'Unknown error');
//     }
//   }
// );



const associationsSlice = createSlice({
  name: 'associations',
  initialState: {
    status: 'idle',
    data: [],
    error: null,
  } as AssociationState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssociations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssociations.fulfilled, (state, action: PayloadAction<Association[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAssociations.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // .addCase(getAssociation.pending, (state) => {
      //   state.status = 'loading';
      // })
      // .addCase(getAssociation.fulfilled, (state, action: PayloadAction<Association>) => {
      //   state.status = 'succeeded';
      //   state.data = [action.payload]; // This will overwrite the entire list of associations with the single one that was fetched
      //   console.log('DATA ASSOCIATION')
      //   console.log(state.data)
      // })
      // .addCase(getAssociation.rejected, (state, action: PayloadAction<any>) => {
      //   state.status = 'failed';
      //   state.error = action.payload;
      // });
  },
  
});

export default associationsSlice.reducer;
