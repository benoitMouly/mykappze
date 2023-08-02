
import { collection, addDoc, getDocs, getDoc, orderBy, doc, getFirestore, deleteDoc, updateDoc,serverTimestamp } from 'firebase/firestore';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Initialisez Firebase



// Actions asynchrones
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (animalId, { rejectWithValue }) => {
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'animals', animalId, 'commentaires'));

      const comments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Convertir les Timestamps en chaînes ISO
      comments.forEach(comment => {
        comment.horodatage = comment.horodatage.toDate().toISOString();
      });

      return comments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ animalId, comment, uid }, { rejectWithValue }) => {
    try {
      const db = getFirestore();
      const docRef = await addDoc(collection(db, 'animals', animalId, 'commentaires'), {
        ...comment,
        horodatage: serverTimestamp(),
        authorId: uid
      });

      // Obtenir le nouveau commentaire ajouté avec son ID
      const docSnap = await getDoc(docRef);
      const newComment = { id: docSnap.id, ...docSnap.data() };

      // Convertir le Timestamp en chaîne ISO
      newComment.horodatage = newComment.horodatage.toDate().toISOString();

      return newComment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const addCommentToState = createSlice({
  name: 'comments/addCommentToState',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addCommentToState, (state, action) => {
      state.push(action.payload);
    });
  },
}).reducer;



export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ animalId, commentId }, { rejectWithValue }) => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'animals', animalId, 'commentaires', commentId));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ animalId, commentId, updatedText }, { rejectWithValue, getState }) => {
    try {
      const db = getFirestore();
      const commentRef = doc(db, 'animals', animalId, 'commentaires', commentId);

      await updateDoc(commentRef, {
        texte: updatedText,
        horodatage: serverTimestamp(),
      });

      // Get the updated comment
      const commentSnap = await getDoc(commentRef);
      const updatedComment = { id: commentSnap.id, ...commentSnap.data() };

      // Convert the Timestamp to ISO string
      updatedComment.horodatage = updatedComment.horodatage.toDate().toISOString();

      return updatedComment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// Slice
const commentsSlice = createSlice({
  name: 'comments',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        
        // fetchComments(action.meta.arg.animalId);
        state.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        return state.filter(comment => comment.id !== action.meta.arg.commentId);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.findIndex((comment) => comment.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      })
  },
});

export default commentsSlice.reducer;
