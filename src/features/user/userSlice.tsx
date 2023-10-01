import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { registerForPushNotificationsAsync } from "../notifications/notificationSlice.tsx";
import { createAndSendNotification } from "../notifications/notificationSlice.tsx";
import axios from "axios";

import firebase from "firebase/compat/app";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateEmail as updateEmailAuth,
  updatePassword as updatePasswordAuth,
  signOut,
  deleteUser as deleteAuthUser,
  signInWithCustomToken,
  onAuthStateChanged,
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
  addDoc,
  Timestamp,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addLicense } from "../licences/licenceSlice.tsx";


// const fetchStripeCustomerId = async (uid) => {
//   const db = getFirestore();
//   const userRef = doc(db, "users", uid);
//   const userDoc = await getDoc(userRef);
//   return userDoc.data().stripeCustomerId;
// };

// import messaging from '@react-native-firebase/messaging';
// import PushNotification from 'react-native-push-notification';

// Enregistrez `expoPushToken` dans le document de l'utilisateur dans Firestore

// async function requestUserPermission() {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     console.log('Authorization status:', authStatus);
//   }
// }

// async function getToken(userId) {
//   let fcmToken = await messaging().getToken();
//   if (fcmToken) {
//     console.log(fcmToken);

//     // Enregistrez le token FCM dans le document de l'utilisateur dans Firestore
//     const db = getFirestore();
//     await updateDoc(doc(db, 'users', userId), {
//       fcmToken: fcmToken,
//     });
//   }
// }




/*

export const createAndSendNotification = createAsyncThunk(
  "notifications/createAndSend",
  async ({ userIds, message }, thunkAPI) => {
    console.log("userIDS !!", userIds);
    try {
      const db = getFirestore();

      // Créez la notification dans Firestore
      const notificationsCollection = collection(db, "notifications");
      await addDoc(notificationsCollection, {
        userIds,
        message,
        view: false,
        date: Date.now(),
      });
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.toString());
    }
  }
); */






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
      const registrationDateJS = docSnapshot.data().registrationDate.toDate();

      // console.log('docSnapshot', docSnapshot);

      try {
        // Obtenir le token Expo Push
        const expoPushToken = await registerForPushNotificationsAsync();
        await updateDoc(userRef, { expoPushToken });
      } catch (error) {
        console.error(
          "Error getting Expo push token or updating Firestore:",
          error
        );
      }

      if (docSnapshot.exists()) {
        const stripeCustomerId = docSnapshot.data().stripeCustomerId;
        if (stripeCustomerId) {
            dispatch(setStripeCustomerId(stripeCustomerId));
        }

        const {
          name,
          surname,
          licenseNumber,
          isMairie,
          isAssociation,
          mairieName,
          associationName,
          notificationsEnabled
        } = docSnapshot.data();
        // console.log('name, surname', name, surname);
        dispatch(setName(name));
        dispatch(setSurname(surname));
        dispatch(setLicense(licenseNumber));
        dispatch(setIsMairie(isMairie));
        dispatch(setIsAssociation(isAssociation));
        dispatch(setMairieName(mairieName));
        dispatch(setAssociationName(associationName));
        dispatch(setRegistrationDate(registrationDateJS));
        dispatch(setNotificationsEnabled(notificationsEnabled))
      }

      // Si la connexion est réussie, mettez à jour AsyncStorage
      await AsyncStorage.setItem("@userIsLoggedIn", "true");

      // console.log("CONNECTE");
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

export const checkUserAuthStatus = createAsyncThunk(
  "auth/checkUserAuthStatus",
  async (_, { dispatch, rejectWithValue }) => {
    const auth = getAuth();

    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log('user is already connected by his status')
          // Si l'utilisateur est connecté
          const db = getFirestore();
          const userRef = doc(db, "users", user.uid);
          const docSnapshot = await getDoc(userRef);




          if (docSnapshot.exists()) {
            const stripeCustomerId = docSnapshot.data().stripeCustomerId;
            if (stripeCustomerId) {
                dispatch(setStripeCustomerId(stripeCustomerId));
            }
    
            const {
              name,
              surname,
              licenseNumber,
              isMairie,
              isAssociation,
              mairieName,
              associationName,
              notificationsEnabled
            } = docSnapshot.data();
            // console.log('name, surname', name, surname);
            dispatch(setName(name));
            dispatch(setSurname(surname));
            dispatch(setLicense(licenseNumber));
            dispatch(setIsMairie(isMairie));
            dispatch(setIsAssociation(isAssociation));
            dispatch(setMairieName(mairieName));
            dispatch(setAssociationName(associationName));
            dispatch(setNotificationsEnabled(notificationsEnabled));
            // dispatch(setRegistrationDate(registrationDateJS));

            // Si la connexion est réussie, mettez à jour AsyncStorage
            await AsyncStorage.setItem("@userIsLoggedIn", "true");
            resolve({ uid: user.uid, email: user.email });
          } else {
            reject("User data does not exist in Firestore");
          }
        } else {
          // Si l'utilisateur est déconnecté
          await AsyncStorage.removeItem("@userIsLoggedIn");
          reject("User is not logged in");
        }

        // Se désabonner de l'écouteur
        unsubscribe();
      }, reject);
    });
  }
);

const updateUserState = (state, action) => {
  state.uid = action.payload.uid;
  state.email = action.payload.email;
  state.isAuthenticated = true;
  state.error = null;
  state.status = "congrats";
  state.userIsMairie = action.payload.isMairie;
  state.userIsAssociation = action.payload.isAssociation;
  state.userAssociationName = action.payload.associationName;
  state.userMairieName = action.payload.mairieName;
  state.userHasLicenseNumber = action.payload.licenseNumber;
};


export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const provider = new firebaseInstance.auth.GoogleAuthProvider();
      const userCredential = await firebaseInstance
        .auth()
        .signInWithPopup(provider);
      const user = userCredential.user;

      const db = firebaseInstance.firestore();
      const userRef = db.doc(`users/${user.uid}`);
      const docSnapshot = await userRef.get();

      // Si l'utilisateur n'existe pas dans Firestore, créez-le
      if (!docSnapshot.exists) {
        const userData = {
          name: user.displayName,
          surname: "", // Google ne fournit pas de prénom/nom séparés, donc vous devrez peut-être gérer cela différemment
          email: user.email,
          photoURL: user.photoURL,
        };

        await userRef.set(userData);
        dispatch(setName(userData.name));
        dispatch(setSurname(userData.surname));
      } else {
        const { name, surname } = docSnapshot.data();
        dispatch(setName(name));
        dispatch(setSurname(surname));
      }
      console.log("UUUSSSSEERRR : ");
      console.log(user.displayName);
      return {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error) {
      return rejectWithValue(error.toString());
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
  { email: string; password: string; name: string; surname: string },
  { rejectValue: string }
>(
  "user/registerUser",
  async (
    {
      email,
      password,
      name,
      surname,
      userType,
      siren,
      isMairie,
      mairieName,
      isAssociation,
      associationName,
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const registrationDate = Timestamp.now().toDate();

      const db = getFirestore();
      const registrationDateJS = registrationDate.toDate();
      const userDoc = doc(db, "users", user.uid);
      const userData = {
        name,
        surname,
        email,
        userType,
        siren,
        isMairie,
        mairieName,
        isAssociation,
        associationName,
        registrationDate: registrationDateJS
      };
      await setDoc(userDoc, userData);
      dispatch(setRegistrationDate(userData.registrationDate));
      return { uid: user.uid, email: user.email };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

/* GOOGLE */

// export const signIn = async () => {
//   try {
//     await GoogleSignin.hasPlayServices();
//     const userInfo = await GoogleSignin.signIn();
//     const token = userInfo.idToken;

//     // Envoyez ce token à votre fonction Cloud pour authentification côté serveur
//     const firebaseToken = await authenticateWithCloudFunction(token);

//     // Utilisez firebaseToken pour vous authentifier avec Firebase dans votre application
//     const auth = getAuth();
//     await signInWithCustomToken(auth, firebaseToken);

//   } catch (error) {
//     console.error(error);
//   }
// };

// const authenticateWithCloudFunction = async (token) => {
//   // Utilisez axios ou fetch pour envoyer une requête à votre fonction Cloud
//   const response = await axios.post('https://us-central1-kappze.cloudfunctions.net/authenticateWithGoogle', { token: token });
//   return response.data.firebaseToken;
// };

// const signOutGoogle = async () => {
//   try {
//     // Déconnectez-vous de Firebase
//     const auth = getAuth();
//     await signOut(auth);

//     // Déconnectez-vous de Google Sign-In
//     await GoogleSignin.revokeAccess();
//     await GoogleSignin.signOut();
//   } catch (error) {
//     console.error(error);
//   }
// };

/* *********************** */

export const updateUserName = createAsyncThunk(
  "user/updateUserName",
  async ({ userId, newName }) => {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { name: newName });
    return { newName };
  }
);

export const updateUserSurname = createAsyncThunk(
  "user/updateUserSurname",
  async ({ userId, newSurname }) => {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { surname: newSurname });
    return { newSurname };
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email) => {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  }
);

export const resetStatus = createAction("auth/resetStatus");

const checkEmailExistsInDatabase = async (email) => {
  const db = getFirestore();
  const usersCollection = collection(db, "users");
  const emailQuery = query(usersCollection, where("email", "==", email));
  const querySnapshot = await getDocs(emailQuery);
  return querySnapshot.size > 0; // Vérifiez si la taille du querySnapshot est supérieure à zéro pour déterminer si l'e-mail existe
};

export const checkEmailExists = createAsyncThunk(
  "auth/checkEmailExists",
  async (email) => {
    // Vérifier si l'adresse e-mail existe dans votre base de données ou autre source de données
    const exists = await checkEmailExistsInDatabase(email);

    if (!exists) {
      throw new Error("Adresse e-mail non valide");
    }
  }
);

export const updateEmail = createAsyncThunk(
  "user/updateEmail",
  async (newEmail) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await updateEmailAuth(user, newEmail);
    }
  }
);

export const updateUserEmail = createAsyncThunk(
  "user/updateUserEmail",
  async ({ userId, newEmail }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await signOut(auth); // Déconnecter l'utilisateur

      await updateEmailAuth(user, newEmail);
      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { email: newEmail });
    }

    return { newEmail };
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (newPassword) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await updatePasswordAuth(user, newPassword);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (_, { getState }) => {
    const state = getState();
    const { uid } = state.auth;

    const auth = getAuth();
    const user = auth.currentUser;

    // Supprimez l'utilisateur de Firebase Authentication
    await deleteAuthUser(user);
    const db = getFirestore();
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
    return uid;
  }
);

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
  status: "idle",
  licenseNumber: null, // ajoutez cela car vous avez défini le status dans AuthState
  registrationDate: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    setRegistrationDate: (state, action) => {
      state.registrationDate = action.payload;
    },
    setStripeCustomerId: (state, action) => {
      state.stripeCustomerId = action.payload;
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
      state.uid = null;
      state.email = null;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setSurname: (state, action) => {
      state.surname = action.payload;
    },
    setLicense: (state, action) => {
      state.licenseNumber = action.payload;
    },
    setIsMairie: (state, action) => {
      state.isMairie = action.payload;
    },
    setIsAssociation: (state, action) => {
      state.isAssociation = action.payload;
    },
    setMairieName: (state, action) => {
      state.mairieName = action.payload;
    },
    setAssociationName: (state, action) => {
      state.associationName = action.payload;
    },
    setNotificationsEnabled: (state, action) => {
      state.notificationsEnabled = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createAndSendNotification.rejected, (state, action) => {
      state.status = "loading";
      if (action.payload) {
        const errorMessage = action.payload || "";
        const errorCode = errorMessage.split("Error (")[1]?.split(").")[0];
        state.error = errorCode;
      } else {
        state.error = action.error.message; // this is the fallback if payload is not available
      }
    });
    builder.addCase(loginUser.fulfilled, updateUserState);
    builder.addCase(checkUserAuthStatus.fulfilled, updateUserState);
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

    builder.addCase(resetPassword.fulfilled, (state) => {
      state.status = "fulfilled";
      state.error = null;
    });
    builder.addCase(resetPassword.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.code;
    });
    builder.addCase(checkEmailExists.rejected, (state, action) => {
      state.status = "failed";
      // state.error = action.error.message;
      if (action.payload) {
        const errorCode = action.payload.code;
        state.error = errorCode;
      }
    });
    builder.addCase(resetStatus, (state) => {
      state.status = null;
      state.error = null;
    });
    builder.addCase(updateEmail.fulfilled, (state, action) => {
      state.email = action.payload;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.password = action.payload;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
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
    builder.addCase(updateUserName.fulfilled, (state, action) => {
      // Mettre à jour l'état avec le nouveau nom
      state.name = action.payload.newName;
    });
    builder.addCase(updateUserName.rejected, (state, action) => {
      // Mettre à jour l'état avec le nouveau nom
      state.status = "failed";
      state.error = action.error
        ? action.error.message
        : "Une erreur s'est produite lors de la mise à jour du nom.";
    });
    builder.addCase(updateUserSurname.fulfilled, (state, action) => {
      // Mettre à jour l'état avec le nouveau prénom
      state.surname = action.payload.newSurname;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      // Effectuez les actions nécessaires après la suppression de l'utilisateur, si nécessaire
    });

    builder.addCase(deleteUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;

      // Gérez les erreurs lors de la suppression de l'utilisateur, si nécessaire
    });
    builder.addCase(loginWithGoogle.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(loginWithGoogle.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(addLicense.fulfilled, (state, action) => {
      state.userHasLicenseNumber = true;
      setLicense(action.licenseId);
      state.licenseNumber = action.payload.licenseNumber;
    });
  },
});

// export const { resetError, loginSuccess, loginFailure, logout, setName, setSurname } = authSlice.actions;

export const {
  loginSuccess,
  logout,
  setName,
  setSurname,
  setLicense,
  setIsMairie,
  setIsAssociation,
  setAssociationName,
  setMairieName,
  setRegistrationDate,
  setStripeCustomerId,
  setNotificationsEnabled
} = authSlice.actions;
// export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export default authSlice.reducer;
