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
  "associations/fetchAssociations",
  async (userId: string, { rejectWithValue }) => {
    try {
      const db = getFirestore();
      const userAssociationsRef = collection(db, "userAssociations");
      const userAssociationsQuery = query(
        userAssociationsRef,
        where("userId", "==", userId)
      );
      const userAssociationsSnapshot = await getDocs(userAssociationsQuery);
      const associationIds = userAssociationsSnapshot.docs.map(
        (doc) => doc.data().associationId
      );
      const associationsData: Association[] = [];

      for (const associationId of associationIds) {
        const associationRef = doc(db, "associations", associationId);
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

          associationsData.push({
            id: associationId,
            isAdmin,
            ...associationData,
          });
        }
      }

      return associationsData;
    } catch (err) {
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);

/*
 * Create Association
 ***
 */

export const addAssociation = createAsyncThunk(
  "associations/addAssociation",
  async ({ userId, associationData }, { rejectWithValue }) => {
    try {
      const db = getFirestore();
      const associationRef = collection(db, "associations");
      const newAssociationRef = await addDoc(associationRef, associationData);
      const newAssociationSnapshot = await getDoc(newAssociationRef);
      const newAssociation = {
        id: newAssociationRef.id,
        ...newAssociationSnapshot.data(),
      };

      // Ajoutez l'ID de l'association à la collection "userAssociations" de l'utilisateur
      const userAssociationsRef = collection(db, "userAssociations");
      await addDoc(userAssociationsRef, {
        userId,
        associationId: newAssociation.id,
      });

      return newAssociation;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAssociation = createAsyncThunk(
  "association/updateAssociation",
  async ({ associationId, associationData }, { rejectWithValue }) => {


    try {
      const db = getFirestore();
      const associationRef = doc(db, "associations", associationId);
      await updateDoc(associationRef, associationData);

      // Mise à jour des animaux associés
      const animalsRef = collection(db, "animals");
      const querySnapshot = await getDocs(
        query(animalsRef, where("associationId", "==", associationId))
        
      );

      const promises = querySnapshot.docs.map((doc) => {
        const animalRef = doc.ref;
        return updateDoc(animalRef, { associationName: associationData.name});
      });

      await Promise.all(promises);

      return { associationId, associationData };
    } catch (error) {
      console.log(error)
      console.log('ASSOCIATION ID -> ')
      console.log(associationId)
      console.log('ASSOCIATION DATA -> ')
      console.log(associationData)

      return rejectWithValue(error.message);
    }
  }
);

/*
 * Delete Association
 ***
 */

export const removeAssociation = createAsyncThunk(
  "associations/removeAssociation",
  async ({ userId, associationId }, { rejectWithValue }) => {
    console.log("slice", userId, associationId);
    try {
      const db = getFirestore();

      // Supprimer l'association de la collection "associations"
      const associationRef = doc(db, "associations", associationId);
      await deleteDoc(associationRef);

      // Supprimer l'ID de l'association de la collection "userAssociations" de l'utilisateur
      const userAssociationsQuery = query(
        collection(db, "userAssociations"),
        where("userId", "==", userId),
        where("associationId", "==", associationId)
      );
      const userAssociationSnapshot = await getDocs(userAssociationsQuery);

      if (!userAssociationSnapshot.empty) {
        // Supposons qu'il n'y ait qu'un seul document qui correspond à la requête
        const docId = userAssociationSnapshot.docs[0].id;
        await deleteDoc(doc(db, "userAssociations", docId));
      } else {
        throw new Error(
          "La liaison entre l'utilisateur et l'association n'a pas été trouvée"
        );
      }

      return { message: "Association supprimée avec succès", associationId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
 * Join Association
 ***
 */

export const joinAssociation = createAsyncThunk(
  "associations/joinAssociation",
  async ({ userId, associationId }, { rejectWithValue }) => {
    try {
      const db = getFirestore();

      // Vérifiez si l'utilisateur existe dans la collection "users"
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        throw new Error("Utilisateur introuvable");
      }

      // Vérifiez si l'association existe dans la collection "associations"
      const associationRef = doc(db, "associations", associationId);
      const associationSnapshot = await getDoc(associationRef);
      if (!associationSnapshot.exists()) {
        throw new Error("Association introuvable");
      }

      // Vérifiez si l'utilisateur est déjà membre de l'association
      const userAssociationsRef = collection(db, "userAssociations");
      const querySnapshot = await getDocs(
        query(
          userAssociationsRef,
          where("userId", "==", userId),
          where("associationId", "==", associationId)
        )
      );
      if (!querySnapshot.empty) {
        throw new Error("L'utilisateur est déjà membre de cette association");
      }

      // Ajoutez l'ID de l'association à la collection "userAssociations" de l'utilisateur
      await addDoc(userAssociationsRef, { userId, associationId });

      // Ajoutez le rôle de l'utilisateur à l'association
      const newRole = { uid: userId, isAdmin: false };
      const associationData = associationSnapshot.data();
      associationData.role = [...associationData.role, newRole];

      await updateDoc(associationRef, associationData);

      // Récupérez les données de l'association
      const updatedAssociationData = {
        id: associationSnapshot.id,
        ...associationData,
      };

      return updatedAssociationData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
 * Add association profile image
 ***
 */

export const uploadImage = async (image) => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(storageRef, image);
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

export const updateAssociationImage = createAsyncThunk(
  "animals/updateAssociationImage",
  async ({ associationId, image }, { rejectWithValue }) => {
    try {
      const imageUrl = await uploadImage(image);
      const db = getFirestore();
      const animalRef = doc(db, "associations", associationId);
      await updateDoc(animalRef, { image: imageUrl });

      return { associationId, imageUrl };
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
  "associations/changeUserRole",
  async ({ userId, associationId, newIsAdmin }, { rejectWithValue }) => {

    console.log('INFORMATIONS CHANGE USER ROLE -> ')
    console.log(userId, associationId, newIsAdmin)
    console.log('----')
    try {
      const db = getFirestore();

      // Vérifiez si l'utilisateur existe dans la collection "users"
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        throw new Error("Utilisateur introuvable");
      }

      // Vérifiez si l'association existe dans la collection "associations"
      const associationRef = doc(db, "associations", associationId);
      const associationSnapshot = await getDoc(associationRef);
      if (!associationSnapshot.exists()) {
        throw new Error("Association introuvable");
      }

      // Mettre à jour le rôle de l'utilisateur dans l'association
      const associationData = associationSnapshot.data();
      for (let role of associationData.role) {
        if (role.uid === userId) {
          role.isAdmin = newIsAdmin;
          break;
        }
      }

      await updateDoc(associationRef, associationData);

      // Récupérez les données de l'association
      const updatedAssociationData = {
        id: associationSnapshot.id,
        ...associationData,
      };

      return updatedAssociationData;
    } catch (error) {
      return rejectWithValue(error.message);
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
  name: "associations",
  initialState: {
    status: "idle",
    data: [],
    error: null,
  } as AssociationState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssociations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAssociations.fulfilled,
        (state, action: PayloadAction<Association[]>) => {
          state.status = "succeeded";
          state.data = action.payload;
        }
      )
      .addCase(
        fetchAssociations.rejected,
        (state, action: PayloadAction<any>) => {
          state.status = "failed";
          state.error = action.payload;
        }
      )
      .addCase(addAssociation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addAssociation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(addAssociation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateAssociation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAssociation.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log('ouyai')
        state.data = state.data.map((association) => {
          if (association.id === action.payload.associationId) {
            return { ...association, ...action.payload.associationData };
          }
          return association;
        });
        if (
          state.selectedAssociation &&
          state.selectedAssociation.id === action.payload.associationId
        ) {
          state.selectedAssociation = {
            ...state.selectedAssociation,
            ...action.payload.associationData,
          };
        }
      })
      .addCase(updateAssociation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
    builder
      .addCase(joinAssociation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(joinAssociation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(joinAssociation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder
    .addCase(changeUserRole.pending, (state) => {
      state.status = "loading";
    })
    .addCase(changeUserRole.fulfilled, (state, action) => {
      state.status = "succeeded";
    
      // Trouver l'index de l'association à mettre à jour dans le tableau
      const index = state.data.findIndex(
        (association) => association.id === action.payload.id
      );
    
      if (index !== -1) {
        // Remplacer l'association existante par la nouvelle
        state.data[index] = action.payload;
      }
    })
    .addCase(changeUserRole.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder
      .addCase(updateAssociationImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAssociationImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { associationId, imageUrl } = action.payload;
        const association = state.data.find(
          (association) => association.id === associationId
        );
        if (association) {
          association.image = imageUrl;
        }
        if (state.selectedAnimal && state.selectedAnimal.id === associationId) {
          state.selectedAnimal.image = imageUrl;
        }
      })
      .addCase(updateAssociationImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder.addCase(removeAssociation.pending, (state) => {
      state.status = "loading";
    });
    builder
      .addCase(removeAssociation.fulfilled, (state, action) => {
        state.status = "succeeded";
        // remove the association from the state
        state.data = state.data.filter(
          (association) => association.id !== action.payload.id
        );
      })

      .addCase(removeAssociation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

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
