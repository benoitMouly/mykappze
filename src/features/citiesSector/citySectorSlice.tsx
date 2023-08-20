import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFirestore, collection, where, query, getDocs, addDoc, updateDoc, deleteDoc, getDoc, doc } from 'firebase/firestore';
import { useAppDispatch } from "../../store/store";

/*
* Fetch citiesSector
***    
*/

// export const fetchCities = createAsyncThunk<
// { canalId: string }
// >('citiesSector/fetchCities', async (canalId) => {
//     const db = getFirestore();
//     const q = query(collection(db, 'citiesSector'), where('canalId', '==', canalId));
//     const querySnapshot = await getDocs(q);
//     const citiesSectorData = [];
//     querySnapshot.forEach((doc) => {
//         citiesSectorData.push({ id: doc.id, ...doc.data() });
//     });
//     return citiesSectorData;
// });




// Définir le type de chaque ville
interface CitySector {
  id: string;
  canalId: string;
  // Inclure ici d'autres propriétés de la ville si nécessaire
}

export const fetchCities = createAsyncThunk<
  CitySector[], // Le type de la valeur de retour de la promesse
  string, // Le type du payload
  {} // Le type des informations de rejet si la promesse est rejetée
>('citiesSector/fetchCities', async (canalId) => {
  const db = getFirestore();
//   console.log(canalId)
  const q = query(collection(db, 'citiesSector'), where('canalId', '==', canalId));
  const querySnapshot = await getDocs(q);
  const citiesSectorData: CitySector[] = [];
  querySnapshot.forEach((doc) => {
    citiesSectorData.push({ id: doc.id, ...doc.data() } as CitySector);
  });
  return citiesSectorData;
});




/*
* Create citySector
***    
*/

export const addCitySector = createAsyncThunk(
    'citiesSector/addCitySector',
    async (canalData, { rejectWithValue }) => {

        // console.log('ASSOCIATION DATA : ')
        // console.log(canalData)
        try {
            const db = getFirestore();
            const canalRef = collection(db, 'citiesSector');
            const newCanalRef = await addDoc(canalRef, canalData);
            const newcitiesSectornapshot = await getDoc(newCanalRef);
            const newCanal = { id: newCanalRef.id, ...newcitiesSectornapshot.data() };
            // console.log('OK ON EST BON')
            // console.log(newCanal)
            return newCanal;
        } catch (error) {
            console.log('OH MON DIEU')
            console.log(error)
            return rejectWithValue(error.message);
        }
    }
);

/*
* Update citySector
***    
*/

export const updateCitySector = createAsyncThunk(
    'citiesSector/updateCitySector',
    async (citySectorData, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const citySectorRef = doc(db, 'citiesSector', citySectorData.id);
            await updateDoc(citySectorRef, citySectorData);
            const updatedCitySectorSnapshot = await getDoc(citySectorRef);
            const updatedCitySector = { id: updatedCitySectorSnapshot.id, ...updatedCitySectorSnapshot.data() };
            return updatedCitySector;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


/*
* Delete citySector
***    
*/

export const deleteCitySector = createAsyncThunk(
    'citiesSector/deleteCitySector',
    async (citySectorId, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const citySectorRef = doc(db, 'citiesSector', citySectorId);
            const citySectorSnapshot = await getDoc(citySectorRef);
            const citySectorData = { id: citySectorSnapshot.id, ...citySectorSnapshot.data() };
            await deleteDoc(citySectorRef);
            return citySectorData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/*
* * * CitySector slice
***    
*/

const citiesSectorSlice = createSlice({
    name: 'citiesSector',
    initialState: {
        status: 'idle',
        data: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCities.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCities.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchCities.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addCitySector.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addCitySector.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload);
            })
            .addCase(addCitySector.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateCitySector.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCitySector.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedCitySectorIndex = state.data.findIndex((citySector) => citySector.id === action.payload.id);
                if (updatedCitySectorIndex >= 0) {
                    state.data[updatedCitySectorIndex] = action.payload;
                }
            })
            .addCase(updateCitySector.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default citiesSectorSlice.reducer;




