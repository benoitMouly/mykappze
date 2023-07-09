import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import firebase from "firebase/compat/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateEmail as updateEmailAuth,
  updatePassword as updatePasswordAuth,
  signOut,
  deleteUser as deleteAuthUser,
} from "firebase/auth";
import {
  updateDoc,
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// export const loginUser = createAsyncThunk<
//   { uid: string; email: string | null },
//   { email: string; password: string },
//   { rejectValue: string }>(
//     'auth/loginUser',
//     async ({ email, password }, { dispatch, rejectWithValue }) => {
//         try {
//             const auth = getAuth();
//             console.log('auth', auth);

//             const userCredential = await signInWithEmailAndPassword(auth, email, password);
//             console.log('userCredential', userCredential);

//             const user = userCredential.user;
//             console.log('user', user);

//             const db = getFirestore();
//             console.log('db', db);

//             const userRef = doc(db, 'users', user.uid);
//             console.log('userRef', userRef);

//             const docSnapshot = await getDoc(userRef);
//             console.log('docSnapshot', docSnapshot);

//             if (docSnapshot.exists()) {
//                 const { name, surname } = docSnapshot.data();
//                 console.log('name, surname', name, surname);
//                 dispatch(setName(name));
//                 dispatch(setSurname(surname));
//             }

//             return { uid: user.uid, email: user.email };
//         } catch (error) {
//             console.log('error in loginUser', error);
//             return rejectWithValue(error.message);
//         }
//     }
// );

export const loginUser = createAsyncThunk<
  { uid: string; email: string | null },
  { email: string; password: string },
  { rejectValue: string }
>(
  "auth/loginUser",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const auth = getAuth();
      // console.log('auth', auth);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // console.log('userCredential', userCredential);

      const user = userCredential.user;
      // console.log('user', user);

      const db = getFirestore();
      // console.log('db', db);

      const userRef = doc(db, "users", user.uid);
      // console.log('userRef', userRef);

      const docSnapshot = await getDoc(userRef);
      // console.log('docSnapshot', docSnapshot);

      if (docSnapshot.exists()) {
        const { name, surname } = docSnapshot.data();
        // console.log('name, surname', name, surname);
        dispatch(setName(name));
        dispatch(setSurname(surname));
      }

      // Si la connexion est réussie, mettez à jour AsyncStorage
      await AsyncStorage.setItem("@userIsLoggedIn", "true");

      console.log("CONNECTE");
      // console.log(AsyncStorage.getItem('userIsLoggedIn'));
      return { uid: user.uid, email: user.email };
    } catch (error) {
      console.log("error in loginUser", error);

      // En cas d'erreur, supprimez également la valeur d'AsyncStorage
      await AsyncStorage.removeItem("@userIsLoggedIn");

      return rejectWithValue(error.message);
    }
  }
);

// Async action for logging out
export const logoutAsync = createAsyncThunk("auth/logoutAsync", async () => {
  await AsyncStorage.removeItem("@userIsLoggedIn");
  return {}; // Just return an empty object. We don't need any payload for logging out.
});

export const registerUser = createAsyncThunk<
{ uid: string; email: string | null },
{ email: string; password: string; name: string; surname: string;},
{ rejectValue: string }
>(
    'user/registerUser',
    async ({ email, password, name, surname }, {dispatch, rejectWithValue}) => {
        try { const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const db = getFirestore();
        const userDoc = doc(db, 'users', user.uid);
        const userData = {
            name,
            surname,
            email,
        };
        await setDoc(userDoc, userData);

        return { uid: user.uid, email: user.email };
    } catch (error) {
        return rejectWithValue(error.toString());
    }
}
);

// export const updateUserName = createAsyncThunk(
//     'user/updateUserName',
//     async ({ userId, newName }) => {
//         const db = getFirestore();
//         const userRef = doc(db, 'users', userId);
//         await updateDoc(userRef, { name: newName });
//         return { newName };
//     }
// );

// export const updateUserSurname = createAsyncThunk(
//     'user/updateUserSurname',
//     async ({ userId, newSurname }) => {
//         const db = getFirestore();
//         const userRef = doc(db, 'users', userId);
//         await updateDoc(userRef, { surname: newSurname });
//         return { newSurname }
//     }
// );

// export const resetPassword = createAsyncThunk(
//     'auth/resetPassword',
//     async (email) => {
//         const auth = getAuth();
//         await sendPasswordResetEmail(auth, email);
//     }
// );

// export const resetStatus = createAction('auth/resetStatus');

// const checkEmailExistsInDatabase = async (email) => {
//     const db = getFirestore();
//     const usersCollection = collection(db, 'users');
//     const emailQuery = query(usersCollection, where('email', '==', email));
//     const querySnapshot = await getDocs(emailQuery);
//     return querySnapshot.size > 0; // Vérifiez si la taille du querySnapshot est supérieure à zéro pour déterminer si l'e-mail existe
// };

// export const checkEmailExists = createAsyncThunk(
//     'auth/checkEmailExists',
//     async (email) => {
//         // Vérifier si l'adresse e-mail existe dans votre base de données ou autre source de données
//         const exists = await checkEmailExistsInDatabase(email);

//         if (!exists) {
//             throw new Error('Adresse e-mail non valide');
//         }
//     }
// );

// export const updateEmail = createAsyncThunk(
//     'user/updateEmail',
//     async (newEmail) => {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (user) {
//             await updateEmailAuth(user, newEmail);
//         }
//     }
// );

// export const updateUserEmail = createAsyncThunk(
//     'user/updateUserEmail',
//     async ({ userId, newEmail }) => {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (user) {
//             await signOut(auth); // Déconnecter l'utilisateur

//             await updateEmailAuth(user, newEmail);
//             const db = getFirestore();
//             const userRef = doc(db, 'users', userId);
//             await updateDoc(userRef, { email: newEmail });
//         }

//         return { newEmail };
//     }
// );

// export const updatePassword = createAsyncThunk(
//     'user/updatePassword',
//     async (newPassword) => {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (user) {
//             await updatePasswordAuth(user, newPassword);
//         }
//     }
// );

// export const deleteUser = createAsyncThunk(
//     'user/deleteUser',
//     async (_, { getState }) => {
//         const state = getState();
//         const { uid } = state.auth;

//         const auth = getAuth();
//         const user = auth.currentUser;

//         // Supprimez l'utilisateur de Firebase Authentication
//         await deleteAuthUser(user);
//         const db = getFirestore();
//         const userRef = doc(db, 'users', uid);
//         await deleteDoc(userRef);
//         return uid;
//     }
// );

interface AuthState {
  uid: string | null;
  email: string | null;
  status: "idle" | "loading" | "failed" | "succeeded";
  isAuthenticated: boolean;
  error: string | null;
  name: string | null;
  surname: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoggedIn: false,
  error: null,
  name: null,
  surname: null,
  uid: null,
  email: null,
  status: "idle", // ajoutez cela car vous avez défini le status dans AuthState
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.error = null;
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },
    loginFailure: (state, action) => {
      console.log("euh");
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state, action) => {
      state.isAuthenticated = false;
      state.name = null;
      state.surname = null;
      state.error = null;
      state.isLoggedIn = false;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setSurname: (state, action) => {
      state.surname = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = "failed";
      state.isAuthenticated = false;
      if (action.payload) {
        const errorMessage = action.payload || "";
        const errorCode = errorMessage.split("Error (")[1]?.split(").")[0];
        state.error = errorCode;
      } else {
        state.error = action.error.message; // this is the fallback if payload is not available
      }
    });
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.name = null;
      state.surname = null;
      state.error = null;
      state.isLoggedIn = false;
    });

    // builder.addCase(resetPassword.fulfilled, (state) => {
    //     state.status = 'fulfilled';
    //     state.error = null;
    // });
    // builder.addCase(resetPassword.pending, (state) => {
    //     state.status = 'loading';
    //     state.error = null;
    // });
    // builder.addCase(resetPassword.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.error.code;
    // });
    // builder.addCase(checkEmailExists.rejected, (state, action) => {
    //     state.status = 'failed';
    //     // state.error = action.error.message;
    //     if(action.payload){
    //         const errorCode = action.payload.code;
    //         state.error = errorCode;
    //     }

    // });
    // builder.addCase(resetStatus, (state) => {
    //     state.status = null;
    //     state.error = null;
    // });
    // builder.addCase(updateEmail.fulfilled, (state, action) => {
    //     state.email = action.payload;
    // });
    // builder.addCase(updatePassword.fulfilled, (state, action) => {
    //     state.password = action.payload;
    // });
    builder.addCase(registerUser.fulfilled, (state, action) => {
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        if (action.payload) {
            const errorMessage = action.payload || "";
            const errorCode = errorMessage.split("Error (")[1]?.split(").")[0];
            state.error = errorCode;
          } else {
            state.error = action.error.message; // this is the fallback if payload is not available
          }
    });
    // builder.addCase(updateUserName.fulfilled, (state, action) => {
    //     // Mettre à jour l'état avec le nouveau nom
    //     state.name = action.payload.newName;
    // });
    // builder.addCase(updateUserName.rejected, (state, action) => {
    //     // Mettre à jour l'état avec le nouveau nom
    //     state.status = 'failed';
    //     state.error = action.error ? action.error.message : "Une erreur s'est produite lors de la mise à jour du nom.";

    // });
    // builder.addCase(updateUserSurname.fulfilled, (state, action) => {
    //     // Mettre à jour l'état avec le nouveau prénom
    //     state.surname = action.payload.newSurname;
    // });
    // builder.addCase(deleteUser.fulfilled, (state, action) => {
    //     // Effectuez les actions nécessaires après la suppression de l'utilisateur, si nécessaire
    // });

    // builder.addCase(deleteUser.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.error.message;

    //     // Gérez les erreurs lors de la suppression de l'utilisateur, si nécessaire
    // });
  },
});

// export const { resetError, loginSuccess, loginFailure, logout, setName, setSurname } = authSlice.actions;

export const { loginSuccess, logout, setName, setSurname } = authSlice.actions;
// export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export default authSlice.reducer;
