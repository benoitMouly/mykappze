import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFirestore, collection, where, query, getDocs, addDoc, updateDoc, deleteDoc, getDoc, doc } from 'firebase/firestore';
import { fetchSectors } from '../../features/sectors/sectorSlice';


/*
* Fetch cities
***    
*/

export const fetchCities = createAsyncThunk('cities/fetchCities', async (associationId) => {
    const db = getFirestore();
    const q = query(collection(db, 'cities'), where('associationId', '==', associationId));
    const querySnapshot = await getDocs(q);
    const citiesData = [];
    querySnapshot.forEach((doc) => {
        citiesData.push({ id: doc.id, ...doc.data() });
    });
    return citiesData;
});


/*
* Fetch sectors from cities
***    
*/

export const fetchAllSectors = async (cities, dispatch) => {
    const allSectors = [];

    for (const city of cities) {
        const sectorsAction = await dispatch(fetchSectors(city.id));
        const sectors = sectorsAction.payload; // unwrap the result of the dispatched action
        allSectors.push(...sectors);
    }

    return allSectors;
};



/*
* Create city
***    
*/

export const addCity = createAsyncThunk(
    'cities/addCity',
    async (associationData, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const associationRef = collection(db, 'cities');
            const newAssociationRef = await addDoc(associationRef, associationData);
            const newcitiesnapshot = await getDoc(newAssociationRef);
            const newAssociation = { id: newAssociationRef.id, ...newcitiesnapshot.data() };
            return newAssociation;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/*
* Update city
***    
*/

export const updateCity = createAsyncThunk(
    'cities/updateCity',
    async (cityData, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const cityRef = doc(db, 'cities', cityData.id);
            await updateDoc(cityRef, cityData);
            const updatedCitySnapshot = await getDoc(cityRef);
            const updatedCity = { id: updatedCitySnapshot.id, ...updatedCitySnapshot.data() };
            return updatedCity;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


/*
* Delete sector
***    
*/

export const deleteCity = createAsyncThunk(
    'cities/deleteSector',
    async (cityId, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const sectorRef = doc(db, 'cities', cityId);
            const citySnapshot = await getDoc(sectorRef);
            const cityData = { id: citySnapshot.id, ...citySnapshot.data() };
            await deleteDoc(sectorRef);
            return cityData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/*
* * * City slice
***    
*/

const citiesSlice = createSlice({
    name: 'cities',
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
            .addCase(addCity.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addCity.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload);
            })
            .addCase(addCity.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateCity.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCity.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedCityIndex = state.data.findIndex((city) => city.id === action.payload.id);
                if (updatedCityIndex >= 0) {
                    state.data[updatedCityIndex] = action.payload;
                }
            })
            .addCase(updateCity.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default citiesSlice.reducer;




