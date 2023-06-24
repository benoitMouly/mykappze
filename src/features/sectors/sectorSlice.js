import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFirestore, collection, where, query, doc, getDocs, addDoc, getDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';

/*
* Fetch sectors by city
***    
*/

export const fetchSectors = createAsyncThunk('sectors/fetchSectors', async (cityId) => {
    const db = getFirestore();
    // console.log('CITY ID SLICE : ',  cityId);
    const q = query(collection(db, 'sectors'), where('cityId', '==', cityId));
    const querySnapshot = await getDocs(q);
    const sectorsData = [];
    querySnapshot.forEach((doc) => {
        sectorsData.push({ id: doc.id, ...doc.data() });
    });

    return sectorsData;
});

/*
* Create sector
***    
*/

export const addSector = createAsyncThunk(
    'sectors/addSector',
    async (associationData, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const associationRef = collection(db, 'sectors');
            const newAssociationRef = await addDoc(associationRef, associationData);
            const newsecteursnapshot = await getDoc(newAssociationRef);
            const newAssociation = { id: newAssociationRef.id, ...newsecteursnapshot.data() };
            return newAssociation;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/*
* Update sector
***    
*/

export const updateSector = createAsyncThunk(
    'sectors/updateSector',
    async (associationData, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const associationRef = doc(db, 'sectors', associationData.id);
            await updateDoc(associationRef, associationData);
            const updatedSectorSnapshot = await getDoc(associationRef);
            const updatedSector = { id: updatedSectorSnapshot.id, ...updatedSectorSnapshot.data() };
            return updatedSector;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/*
* Delete sector
***    
*/

export const deleteSector = createAsyncThunk(
    'sectors/deleteSector',
    async (sectorId, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const sectorRef = doc(db, 'sectors', sectorId);
            const sectorSnapshot = await getDoc(sectorRef);
            const sectorData = { id: sectorSnapshot.id, ...sectorSnapshot.data() };
            await deleteDoc(sectorRef);
            return sectorData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



export const removeCitySectors = createAsyncThunk(
    'sectors/removeCitySectors',
    async (cityId, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const q = query(collection(db, 'sectors'), where('cityId', '==', cityId));
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);
            querySnapshot.forEach((sectorDoc) => {
                const sectorRef = doc(db, 'sectors', sectorDoc.id);
                batch.delete(sectorRef);
            });
            await batch.commit();

            // Return the cityId
            return cityId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


/*
* * * Sector slice
***    
*/

const sectorsSlice = createSlice({
    name: 'sectors',
    initialState: {
        status: 'idle',
        data: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSectors.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSectors.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchSectors.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addSector.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addSector.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload);
            })
            .addCase(addSector.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteSector.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.filter(sector => sector.id !== action.payload.id);
            })
            .addCase(deleteSector.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateSector.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.data.findIndex(sector => sector.id === action.payload.id);
                if (index !== -1) {
                    state.data.splice(index, 1, action.payload);
                }
            })
            .addCase(updateSector.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(removeCitySectors.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.filter((sector) => sector.cityId !== action.payload);
            });
    },
});

export default sectorsSlice.reducer;




