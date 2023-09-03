import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Action,
} from "@reduxjs/toolkit";
import {
  getFirestore,
  collection,
  where,
  query,
  getDocs,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import * as FileSystem from 'expo-file-system';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'; // à installer avec npm ou yarn



interface Canal {
  id: string;
  isAdmin: boolean;
  [key: string]: any;
}

interface CanalState {
  status: string;
  data: Canal[];
  error: string | null;
}

export const fetchCanals = createAsyncThunk<Canal[], string>(
  "canals/fetchCanals",
  async (userId: string, { rejectWithValue }) => {
    try {
      const db = getFirestore();
      const userCanalsRef = collection(db, "userCanals");
      const userCanalsQuery = query(
        userCanalsRef,
        where("userId", "==", userId)
      );
      const userCanalsSnapshot = await getDocs(userCanalsQuery);
      const canalIds = userCanalsSnapshot.docs.map(
        (doc) => doc.data().canalId
      );
      const canalsData: Canal[] = [];

      for (const canalId of canalIds) {
        const canalRef = doc(db, "canals", canalId);
        const canalSnapshot = await getDoc(canalRef);

        if (canalSnapshot.exists()) {
          const canalData = canalSnapshot.data();
          let isAdmin = false;

          if (Array.isArray(canalData.role)) {
            for (let role of canalData.role) {
              if (role.uid === userId && role.isAdmin) {
                isAdmin = true;
                break;
              }
            }
          }

          canalsData.push({
            id: canalId,
            isAdmin,
            ...canalData,
          });
        }
      }

      return canalsData;
    } catch (err) {
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);

/*
 * Create Canal
 ***
 */

export const addCanal = createAsyncThunk(
  "canals/addCanal",
  async ({ userId, canalData }, { rejectWithValue }) => {
    try {
      const db = getFirestore();
      const canalRef = collection(db, "canals");
      const newCanalRef = await addDoc(canalRef, canalData);
      const newCanalSnapshot = await getDoc(newCanalRef);
      const newCanal = {
        id: newCanalRef.id,
        ...newCanalSnapshot.data(),
      };

      // Ajoutez l'ID de l'canal à la collection "userCanals" de l'utilisateur
      const userCanalsRef = collection(db, "userCanals");
      await addDoc(userCanalsRef, {
        userId,
        canalId: newCanal.id,
      });

      return newCanal;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCanal = createAsyncThunk(
  "canal/updateCanal",
  async ({ canalId, canalData }, { rejectWithValue }) => {


    try {
      const db = getFirestore();
      const canalRef = doc(db, "canals", canalId);
      await updateDoc(canalRef, canalData);

      // Mise à jour des animaux associés
      const animalsRef = collection(db, "animals");
      const querySnapshot = await getDocs(
        query(animalsRef, where("canalId", "==", canalId))
        
      );

      const promises = querySnapshot.docs.map((doc) => {
        const animalRef = doc.ref;
        return updateDoc(animalRef, { canalName: canalData.name});
      });

      await Promise.all(promises);

      return { canalId, canalData };
    } catch (error) {
      console.log(error)
      console.log('ASSOCIATION ID -> ')
      console.log(canalId)
      console.log('ASSOCIATION DATA -> ')
      console.log(canalData)

      return rejectWithValue(error.message);
    }
  }
);

/*
 * Delete Canal
 ***
 */

export const removeCanal = createAsyncThunk(
  "canals/removeCanal",
  async ({ userId, canalId }, { rejectWithValue }) => {
    console.log("slice", userId, canalId);
    try {
      const db = getFirestore();

      // Supprimer l'canal de la collection "canals"
      const canalRef = doc(db, "canals", canalId);
      await deleteDoc(canalRef);

      // Supprimer l'ID de l'canal de la collection "userCanals" de l'utilisateur
      const userCanalsQuery = query(
        collection(db, "userCanals"),
        where("userId", "==", userId),
        where("canalId", "==", canalId)
      );
      const userCanalSnapshot = await getDocs(userCanalsQuery);

      if (!userCanalSnapshot.empty) {
        // Supposons qu'il n'y ait qu'un seul document qui correspond à la requête
        const docId = userCanalSnapshot.docs[0].id;
        await deleteDoc(doc(db, "userCanals", docId));
      } else {
        throw new Error(
          "La liaison entre l'utilisateur et l'canal n'a pas été trouvée"
        );
      }

      return { message: "Canal supprimée avec succès", canalId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
 * Join Canal
 ***
 */

export const joinCanal = createAsyncThunk(
  "canals/joinCanal",
  async ({ userId, canalId }, { rejectWithValue }) => {
    try {
      const db = getFirestore();

      // Vérifiez si l'utilisateur existe dans la collection "users"
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        throw new Error("Utilisateur introuvable");
      }

      // Vérifiez si l'canal existe dans la collection "canals"
      const canalRef = doc(db, "canals", canalId);
      const canalSnapshot = await getDoc(canalRef);
      if (!canalSnapshot.exists()) {
        throw new Error("Canal introuvable");
      }

      // Vérifiez si l'utilisateur est déjà membre de l'canal
      const userCanalsRef = collection(db, "userCanals");
      const querySnapshot = await getDocs(
        query(
          userCanalsRef,
          where("userId", "==", userId),
          where("canalId", "==", canalId)
        )
      );
      if (!querySnapshot.empty) {
        throw new Error("L'utilisateur est déjà membre de cette canal");
      }

      // Ajoutez l'ID de l'canal à la collection "userCanals" de l'utilisateur
      await addDoc(userCanalsRef, { userId, canalId });

      // Ajoutez le rôle de l'utilisateur à l'canal
      const newRole = { uid: userId, isAdmin: false };
      const canalData = canalSnapshot.data();
      canalData.role = [...canalData.role, newRole];

      await updateDoc(canalRef, canalData);

      // Récupérez les données de l'canal
      const updatedCanalData = {
        id: canalSnapshot.id,
        ...canalData,
      };

      return updatedCanalData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
 * Add canal profile image
 ***
 */

// export const uploadImage = async (image) => {
//   console.log('IMMAAAGE : ' , image)
//   try {
//     const storage = getStorage();
//     const storageRef = ref(storage, `images/${image.name}`);
//     await uploadBytes(storageRef, image);
//     const imageUrl = await getDownloadURL(storageRef);
//     return imageUrl;
//   } catch (error) {
//     throw new Error(
//       `Une erreur s'est produite lors du téléchargement de l'image : ${error.message}`
//     );
//   }
// };

export const uploadImage = async (imageUri, imageName) => {
  try {
    const storage = getStorage();
    const imageName = uuidv4(); // générer un nom unique pour l'image
    const storageRef = ref(storage, `images/${imageName}`);

    // Convertir l'image en blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Télécharger le blob sur Firebase Storage
    await uploadBytes(storageRef, blob);
    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  } catch (error) {
    throw new Error(
      `Une erreur s'est produite lors du téléchargement de l'image : ${error.message}`
    );
  }
};

/*
 * Update animal image
 ***
 */

export const updateCanalImage = createAsyncThunk(
  "animals/updateCanalImage",
  async ({ canalId, image }, { rejectWithValue }) => {
    try {
      const imageUrl = await uploadImage(image);
      const db = getFirestore();
      const animalRef = doc(db, "canals", canalId);
      await updateDoc(animalRef, { image: imageUrl });

      return { canalId, imageUrl };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
 * Modify user role
 ***
 */

export const changeUserRole = createAsyncThunk(
  "canals/changeUserRole",
  async ({ userId, canalId, newIsAdmin }, { rejectWithValue }) => {

    console.log('INFORMATIONS CHANGE USER ROLE -> ')
    console.log(userId, canalId, newIsAdmin)
    console.log('----')
    try {
      const db = getFirestore();

      // Vérifiez si l'utilisateur existe dans la collection "users"
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        throw new Error("Utilisateur introuvable");
      }

      // Vérifiez si l'canal existe dans la collection "canals"
      const canalRef = doc(db, "canals", canalId);
      const canalSnapshot = await getDoc(canalRef);
      if (!canalSnapshot.exists()) {
        throw new Error("Canal introuvable");
      }

      // Mettre à jour le rôle de l'utilisateur dans l'canal
      const canalData = canalSnapshot.data();
      for (let role of canalData.role) {
        if (role.uid === userId) {
          role.isAdmin = newIsAdmin;
          break;
        }
      }

      await updateDoc(canalRef, canalData);

      // Récupérez les données de l'canal
      const updatedCanalData = {
        id: canalSnapshot.id,
        ...canalData,
      };

      return updatedCanalData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export const getCanal = createAsyncThunk<Canal, string>(
//   'canals/getCanal',
//   async (canalId: string | any , { rejectWithValue }) => {
//     try {
//       const db = getFirestore();
//       const canalRef = doc(db, 'canals', canalId);
//       const canalSnapshot = await getDoc(canalRef);

//       if (!canalSnapshot.exists()) {
//         throw new Error('Canal not found');
//       }

//       const canalData = canalSnapshot.data();
//       let isAdmin = false;

//       if (Array.isArray(canalData.role)) {
//         // Use your logic here to determine if a user is an admin
//         // For example:
//         // const { uid } = firebase.auth().currentUser;
//         // isAdmin = canalData.role.some(role => role.uid === uid && role.isAdmin);
//       }

//       return { id: canalId, isAdmin, ...canalData };
//     } catch (err) {
//       return rejectWithValue(err.message || 'Unknown error');
//     }
//   }
// );

const canalsSlice = createSlice({
  name: "canals",
  initialState: {
    status: "idle",
    data: [],
    error: null,
  } as CanalState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCanals.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCanals.fulfilled,
        (state, action: PayloadAction<Canal[]>) => {
          state.status = "succeeded";
          state.data = action.payload;
        }
      )
      .addCase(
        fetchCanals.rejected,
        (state, action: PayloadAction<any>) => {
          state.status = "failed";
          state.error = action.payload;
        }
      )
      .addCase(addCanal.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCanal.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(addCanal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCanal.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCanal.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log('updated canal')
        state.data = state.data.map((canal) => {
          if (canal.id === action.payload.canalId) {
            return { ...canal, ...action.payload.canalData };
          }
          return canal;
        });
        if (
          state.selectedCanal &&
          state.selectedCanal.id === action.payload.canalId
        ) {
          state.selectedCanal = {
            ...state.selectedCanal,
            ...action.payload.canalData,
          };
        }
      })
      .addCase(updateCanal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
    builder
      .addCase(joinCanal.pending, (state) => {
        state.status = "loading";
      })
      .addCase(joinCanal.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(joinCanal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder
    .addCase(changeUserRole.pending, (state) => {
      state.status = "loading";
    })
    .addCase(changeUserRole.fulfilled, (state, action) => {
      state.status = "succeeded";
    
      // Trouver l'index de l'canal à mettre à jour dans le tableau
      const index = state.data.findIndex(
        (canal) => canal.id === action.payload.id
      );
    
      if (index !== -1) {
        // Remplacer l'canal existante par la nouvelle
        state.data[index] = action.payload;
      }
    })
    .addCase(changeUserRole.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder
      .addCase(updateCanalImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCanalImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { canalId, imageUrl } = action.payload;
        const canal = state.data.find(
          (canal) => canal.id === canalId
        );
        if (canal) {
          canal.image = imageUrl;
        }
        if (state.selectedAnimal && state.selectedAnimal.id === canalId) {
          state.selectedAnimal.image.url = imageUrl;
        }
      })
      .addCase(updateCanalImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder.addCase(removeCanal.pending, (state) => {
      state.status = "loading";
    });
    builder
      .addCase(removeCanal.fulfilled, (state, action) => {
        state.status = "succeeded";
        // remove the canal from the state
        state.data = state.data.filter(
          (canal) => canal.id !== action.payload.id
        );
      })

      .addCase(removeCanal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // .addCase(getCanal.pending, (state) => {
    //   state.status = 'loading';
    // })
    // .addCase(getCanal.fulfilled, (state, action: PayloadAction<Canal>) => {
    //   state.status = 'succeeded';
    //   state.data = [action.payload]; // This will overwrite the entire list of canals with the single one that was fetched
    //   console.log('DATA ASSOCIATION')
    //   console.log(state.data)
    // })
    // .addCase(getCanal.rejected, (state, action: PayloadAction<any>) => {
    //   state.status = 'failed';
    //   state.error = action.payload;
    // });
  },
});

export default canalsSlice.reducer;
