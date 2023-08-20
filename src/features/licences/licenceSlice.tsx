import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { getFirestore, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

export const addLicense = createAsyncThunk(
    'license/addLicense',
    async ({ userId, licenseId }, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            let licenseData;
            let currentLicenseDetails;
            if (licenseId) {
                console.log('liceneId: ', licenseId)
                const licenseDocRef = doc(db, 'licences', licenseId);
                const licenseDoc = await getDoc(licenseDocRef);
                if (licenseDoc.exists()) {
                    currentLicenseDetails = licenseDoc.data();
                } else {
                    return rejectWithValue('La licence spécifiée n\'existe pas.');
                }
            }

            if (currentLicenseDetails) {
                console.log("Détails de la licence actuelle:", currentLicenseDetails);
                
                const currentExpiryDate = new Date(currentLicenseDetails.expiryDate);
                console.log("Date d'expiration de la licence actuelle:", currentExpiryDate);
                
                const newLicenseNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
                console.log("Nouveau numéro de licence:", newLicenseNumber);
                
                const newDateIssued = currentExpiryDate;
                console.log("Nouvelle date d'émission:", newDateIssued);
                
                const newExpiryDate = new Date(newDateIssued);
                newExpiryDate.setFullYear(newDateIssued.getFullYear() + 1);
                console.log("Nouvelle date d'expiration:", newExpiryDate);
                
                licenseData = {
                    licenseNumber: newLicenseNumber,
                    userId,
                    dateIssued: newDateIssued.toISOString(),
                    expiryDate: newExpiryDate.toISOString(),
                    status: "active"
                };
                console.log("Données de la nouvelle licence:", licenseData);
                
                const licenseDoc = doc(db, 'licences', newLicenseNumber);
                await setDoc(licenseDoc, licenseData);
                
                const userDoc = doc(db, 'users', userId);
                await updateDoc(userDoc, { licenseNumber: newLicenseNumber });
            }
            else {

                console.log('OUAAIAIII')
                // Générer un numéro de licence unique
                const licenseNumber = Math.random().toString(36).substr(2, 9).toUpperCase();

                // Date d'émission et date d'expiration
                const dateIssued = new Date();
                const expiryDate = new Date();
                expiryDate.setFullYear(dateIssued.getFullYear() + 1);

                licenseData = {
                    licenseNumber,
                    userId,
                    dateIssued: dateIssued.toISOString(),
                    expiryDate: expiryDate.toISOString(),
                    status: "active"
                };

                // Ajouter la licence à la collection 'licences'
                const licenseDoc = doc(db, 'licences', licenseNumber);
                await setDoc(licenseDoc, licenseData);

                // Mettre à jour l'utilisateur avec le numéro de licence
                const userDoc = doc(db, 'users', userId);
                await updateDoc(userDoc, { licenseNumber });
            }

            return licenseData;

        } catch (error) {
            return rejectWithValue(error.toString());
        }
    }
);


export const fetchLicenseById = createAsyncThunk(
    'license/fetchLicenseById',
    async (licenseId, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const licenseDocRef = doc(db, 'licences', licenseId);
            const licenseDoc = await getDoc(licenseDocRef);

            if (licenseDoc.exists()) {
                return licenseDoc.data();
            } else {
                return rejectWithValue('La licence spécifiée n\'existe pas.');
            }
        } catch (error) {
            return rejectWithValue(error.toString());
        }
    }
);

const licenseSlice = createSlice({
    name: 'license',
    initialState: {
        license: null,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addLicense.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addLicense.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.license = action.payload;
            })
            .addCase(addLicense.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchLicenseById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLicenseById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.license = action.payload;
            })
            .addCase(fetchLicenseById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});


// export const { addLicense } = licenseSlice.actions;
export default licenseSlice.reducer;